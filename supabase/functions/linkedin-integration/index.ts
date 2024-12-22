import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { linkedInApi } from './api.ts';
import { linkedInAuth } from './auth.ts';

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
      throw new Error('LinkedIn credentials missing');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (action) {
      case 'auth-url': {
        const { redirectUri } = data;
        const state = crypto.randomUUID();
        console.log('Generating auth URL with redirect URI:', redirectUri);
        const authUrl = linkedInAuth.generateAuthUrl(linkedinClientId, redirectUri, state);
        
        return new Response(
          JSON.stringify({ url: authUrl, state }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'exchange-code': {
        const { code, userId, redirectUri } = data;
        console.log('Exchanging code with redirect URI:', redirectUri);
        
        const tokenData = await linkedInApi.getAccessToken(
          code,
          redirectUri,
          linkedinClientId,
          linkedinClientSecret
        );
        
        const profileData = await linkedInApi.getProfile(tokenData.access_token);

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

        if (upsertError) throw upsertError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'post': {
        const { content, userId } = data;
        
        const { data: connection, error: fetchError } = await supabaseClient
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'active')
          .single();

        if (fetchError || !connection) {
          throw new Error('LinkedIn connection not found or inactive');
        }

        const result = await linkedInApi.createPost(
          connection.access_token,
          connection.linkedin_id,
          content
        );

        return new Response(
          JSON.stringify({ success: true, data: result }),
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