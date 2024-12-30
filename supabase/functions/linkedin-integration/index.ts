import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LinkedInApi } from "./api.ts";
import { LinkedInAuth } from "./auth.ts";

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
    const auth = new LinkedInAuth(
      Deno.env.get('LINKEDIN_CLIENT_ID') || '',
      Deno.env.get('LINKEDIN_CLIENT_SECRET') || ''
    );
    const api = new LinkedInApi(auth);

    console.log('LinkedIn integration request:', { action, data });

    switch (action) {
      case 'post':
        const postResult = await api.createPost(data.userId, data.content);
        return new Response(
          JSON.stringify(postResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'analyze':
        const analyticsResult = await api.getPostAnalytics(data.postId);
        return new Response(
          JSON.stringify(analyticsResult),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error(`Action non supportée: ${action}`);
    }
  } catch (error) {
    console.error('Erreur dans linkedin-integration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});