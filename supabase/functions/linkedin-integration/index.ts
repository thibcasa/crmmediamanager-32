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

    console.log('LinkedIn Integration - Action:', action, 'Data:', {
      ...data,
      code: data.code ? '***' : undefined,
      access_token: data.access_token ? '***' : undefined
    });

    if (!linkedinClientId || !linkedinClientSecret) {
      throw new Error('LinkedIn credentials missing');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (action) {
      case 'auth-url': {
        const { redirectUri } = data;
        const scope = 'openid profile w_member_social email';
        const state = crypto.randomUUID();
        
        console.log('Generating auth URL with:', {
          redirectUri,
          scope,
          state: state.substring(0, 8) + '...'
        });
        
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
          `response_type=code&` +
          `client_id=${linkedinClientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUri)}&` +
          `state=${state}&` +
          `scope=${encodeURIComponent(scope)}`;

        console.log('Generated auth URL:', authUrl.substring(0, 100) + '...');

        return new Response(
          JSON.stringify({ url: authUrl, state }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'exchange-code': {
        console.log('Starting code exchange process');
        const { code, userId, redirectUri } = data;

        if (!code || !userId || !redirectUri) {
          throw new Error('Missing required parameters for code exchange');
        }

        console.log('Exchanging code for token with params:', {
          userId,
          redirectUri,
          code: code.substring(0, 8) + '...'
        });

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
            redirect_uri: redirectUri,
          }),
        });

        const tokenData = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          console.error('Token exchange error:', tokenData);
          throw new Error(`Failed to exchange code: ${tokenData.error_description || 'Unknown error'}`);
        }

        console.log('Successfully obtained token');

        // Get LinkedIn profile
        const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });

        const profileData = await profileResponse.json();
        
        if (!profileResponse.ok) {
          console.error('Profile fetch error:', profileData);
          throw new Error('Failed to fetch LinkedIn profile');
        }

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

        console.log('Successfully stored LinkedIn connection');

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'post': {
        console.log('Starting LinkedIn post process');
        const { content, userId } = data;
        
        if (!content || !userId) {
          throw new Error('Missing required parameters for post');
        }

        // Fetch user's LinkedIn connection
        const { data: connection, error: fetchError } = await supabaseClient
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        if (fetchError || !connection) {
          console.error('Error fetching LinkedIn connection:', fetchError);
          throw new Error('LinkedIn connection not found or inactive');
        }

        console.log('Found active LinkedIn connection');

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

        console.log('Successfully posted to LinkedIn');

        return new Response(
          JSON.stringify({ success: true, data: postResult }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

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