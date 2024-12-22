import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const linkedinClientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const linkedinClientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');

    if (!linkedinClientId || !linkedinClientSecret) {
      console.error('LinkedIn credentials not configured');
      throw new Error('LinkedIn integration not configured');
    }

    switch (action) {
      case 'auth-url':
        const redirectUri = `${req.headers.get('origin')}/linkedin-callback`;
        const scope = 'r_liteprofile w_member_social r_emailaddress w_member_social';
        const state = crypto.randomUUID();
        
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${linkedinClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}&` +
          `scope=${encodeURIComponent(scope)}`;

        return new Response(
          JSON.stringify({ url: authUrl }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'exchange-code':
        const { code } = data;
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: linkedinClientId,
            client_secret: linkedinClientSecret,
            redirect_uri: `${req.headers.get('origin')}/linkedin-callback`,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          console.error('Error exchanging code:', tokenData);
          throw new Error('Failed to exchange code for token');
        }

        // Get user profile to store with token
        const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        const profileData = await profileResponse.json();

        // Store token in Supabase
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { error: upsertError } = await supabaseClient
          .from('linkedin_connections')
          .upsert({
            user_id: data.userId,
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            linkedin_id: profileData.id,
            refresh_token: tokenData.refresh_token,
          });

        if (upsertError) {
          console.error('Error storing token:', upsertError);
          throw new Error('Failed to store LinkedIn connection');
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'post':
        // Verify we have valid token
        const { userId, content } = data;
        
        const { data: connection, error: fetchError } = await supabaseClient
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (fetchError || !connection) {
          console.error('Error fetching LinkedIn connection:', fetchError);
          throw new Error('LinkedIn connection not found');
        }

        // Make post to LinkedIn
        const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${connection.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: `urn:li:person:${connection.linkedin_id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: content
                },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
          })
        });

        const postResult = await postResponse.json();
        
        if (!postResponse.ok) {
          console.error('Error posting to LinkedIn:', postResult);
          throw new Error('Failed to post to LinkedIn');
        }

        return new Response(
          JSON.stringify(postResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Action non supportée');
    }
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});