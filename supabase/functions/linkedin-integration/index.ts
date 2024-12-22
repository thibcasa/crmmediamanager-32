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

    console.log('LinkedIn Integration - Action:', action, 'Data:', data);

    if (!linkedinClientId || !linkedinClientSecret) {
      throw new Error('LinkedIn credentials missing');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (action) {
      case 'auth-url':
        const redirectUri = `${req.headers.get('origin')}/linkedin-callback`;
        const scope = 'r_liteprofile w_member_social r_emailaddress w_member_social';
        const state = crypto.randomUUID();
        
        console.log('Generating auth URL with redirect:', redirectUri);
        
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${linkedinClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}&` +
          `scope=${encodeURIComponent(scope)}`;

        return new Response(
          JSON.stringify({ url: authUrl, state }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'exchange-code':
        console.log('Exchanging code for token');
        const { code, userId } = data;

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
          console.error('Token exchange error:', tokenData);
          throw new Error('Failed to exchange code for token');
        }

        // Get LinkedIn profile
        const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        const profileData = await profileResponse.json();
        console.log('Retrieved LinkedIn profile:', profileData.id);

        // Store connection in database
        const { error: upsertError } = await supabaseClient
          .from('linkedin_connections')
          .upsert({
            user_id: userId,
            linkedin_id: profileData.id,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            status: 'active'
          });

        if (upsertError) {
          console.error('Error storing LinkedIn connection:', upsertError);
          throw new Error('Failed to store LinkedIn connection');
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'post':
        console.log('Attempting to post to LinkedIn');
        const { content, userId: postUserId } = data;
        
        // Fetch user's LinkedIn connection
        const { data: connection, error: fetchError } = await supabaseClient
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', postUserId)
          .eq('status', 'active')
          .single();

        if (fetchError || !connection) {
          console.error('Error fetching LinkedIn connection:', fetchError);
          throw new Error('LinkedIn connection not found or inactive');
        }

        // Create the post
        const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${connection.access_token}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
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
          throw new Error(`Failed to post to LinkedIn: ${postResult.message || 'Unknown error'}`);
        }

        console.log('Successfully posted to LinkedIn:', postResult);

        return new Response(
          JSON.stringify({ success: true, data: postResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  } catch (error) {
    console.error('LinkedIn Integration Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});