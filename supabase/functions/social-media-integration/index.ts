import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders } from './config.ts';
import { SocialMediaRequest, SocialMediaResponse } from './types.ts';
import {
  postToFacebook,
  postToInstagram,
  postToLinkedIn,
  postToTwitter,
  postToTikTok,
  sendToWhatsApp
} from './platforms/index.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, content, schedule, targetingCriteria } = await req.json() as SocialMediaRequest;
    console.log(`📱 Nouvelle requête de publication sur ${platform}`);
    console.log(`📝 Contenu: ${content}`);
    console.log(`📅 Planning: ${JSON.stringify(schedule)}`);
    console.log(`🎯 Ciblage: ${JSON.stringify(targetingCriteria)}`);

    let result;

    switch (platform) {
      case 'facebook':
        result = await postToFacebook(content, schedule);
        break;
      case 'instagram':
        result = await postToInstagram(content, schedule);
        break;
      case 'linkedin':
        result = await postToLinkedIn(content, schedule);
        break;
      case 'whatsapp':
        result = await sendToWhatsApp(content, schedule);
        break;
      case 'twitter':
      case 'x':
        result = await postToTwitter(content, schedule);
        break;
      case 'tiktok':
        result = await postToTikTok(content, schedule);
        break;
      default:
        throw new Error(`Plateforme non supportée: ${platform}`);
    }

    console.log(`✅ Publication programmée sur ${platform}:`, result);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`❌ Erreur lors de la publication:`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});