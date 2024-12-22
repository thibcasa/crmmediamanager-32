import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, action, data } = await req.json();
    console.log(`Processing ${action} for ${platform}:`, data);

    // Configuration des API keys
    const config = {
      linkedin: {
        clientId: Deno.env.get("LINKEDIN_CLIENT_ID"),
        clientSecret: Deno.env.get("LINKEDIN_CLIENT_SECRET"),
      },
      facebook: {
        appId: Deno.env.get("FACEBOOK_APP_ID"),
        appSecret: Deno.env.get("FACEBOOK_APP_SECRET"),
      },
      instagram: {
        appId: Deno.env.get("INSTAGRAM_APP_ID"),
        appSecret: Deno.env.get("INSTAGRAM_APP_SECRET"),
      }
    };

    let result;
    switch (platform) {
      case "linkedin":
        result = await handleLinkedInAction(action, data, config.linkedin);
        break;
      case "facebook":
        result = await handleFacebookAction(action, data, config.facebook);
        break;
      case "instagram":
        result = await handleInstagramAction(action, data, config.instagram);
        break;
      default:
        throw new Error(`Plateforme non supportée: ${platform}`);
    }

    // Mise à jour de la campagne dans Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (action === "post" && result.success) {
      await supabaseClient
        .from("social_campaigns")
        .update({ 
          status: "active",
          updated_at: new Date().toISOString()
        })
        .eq("id", data.campaignId);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur dans social-media-integration:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleLinkedInAction(action: string, data: any, config: any) {
  switch (action) {
    case "post":
      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: `urn:li:person:${data.userId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: data.content
              },
              shareMediaCategory: "NONE"
            }
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
          }
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la publication sur LinkedIn");
      }

      return { success: true, data: await response.json() };

    default:
      throw new Error(`Action LinkedIn non supportée: ${action}`);
  }
}

async function handleFacebookAction(action: string, data: any, config: any) {
  // Implémentation similaire pour Facebook
  return { success: true, message: "Facebook integration à implémenter" };
}

async function handleInstagramAction(action: string, data: any, config: any) {
  // Implémentation similaire pour Instagram
  return { success: true, message: "Instagram integration à implémenter" };
}