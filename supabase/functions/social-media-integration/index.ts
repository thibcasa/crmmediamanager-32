import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, content, targetingCriteria } = await req.json();
    console.log(`📱 Nouvelle requête de publication sur ${platform}`);
    console.log(`📝 Contenu: ${content}`);
    console.log(`🎯 Ciblage: ${JSON.stringify(targetingCriteria)}`);

    let result;

    switch (platform) {
      case 'facebook':
        result = await postToFacebook(content);
        break;
      case 'instagram':
        result = await postToInstagram(content);
        break;
      case 'linkedin':
        result = await postToLinkedIn(content);
        break;
      case 'whatsapp':
        result = await sendToWhatsApp(content);
        break;
      default:
        throw new Error(`Plateforme non supportée: ${platform}`);
    }

    console.log(`✅ Publication réussie sur ${platform}:`, result);
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

async function postToFacebook(content: string) {
  const accessToken = Deno.env.get('FACEBOOK_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Token Facebook manquant');

  const response = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur Facebook: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

async function postToInstagram(content: string) {
  const accessToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Token Instagram manquant');

  // Première étape : créer un conteneur média
  const createContainer = await fetch(`https://graph.facebook.com/v18.0/me/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caption: content,
      access_token: accessToken,
    }),
  });

  if (!createContainer.ok) {
    const error = await createContainer.json();
    throw new Error(`Erreur Instagram: ${JSON.stringify(error)}`);
  }

  const { id } = await createContainer.json();

  // Deuxième étape : publier le conteneur
  const publishResponse = await fetch(`https://graph.facebook.com/v18.0/me/media_publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creation_id: id,
      access_token: accessToken,
    }),
  });

  if (!publishResponse.ok) {
    const error = await publishResponse.json();
    throw new Error(`Erreur lors de la publication Instagram: ${JSON.stringify(error)}`);
  }

  return await publishResponse.json();
}

async function postToLinkedIn(content: string) {
  const accessToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Token LinkedIn manquant');

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: `urn:li:person:${accessToken}`,
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
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Erreur LinkedIn: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

async function sendToWhatsApp(content: string) {
  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  if (!accessToken) throw new Error('Token WhatsApp manquant');

  // Implement WhatsApp Business API integration here
  // This is a placeholder for the actual implementation
  console.log('WhatsApp message would be sent:', content);
  
  return { success: true, message: 'WhatsApp message scheduled' };
}