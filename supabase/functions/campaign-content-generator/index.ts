import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { campaignName, platform, targetAudience } = await req.json()
    console.log('Generating campaign content for:', { campaignName, platform, targetAudience })

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en marketing immobilier et SEO. Tu dois générer du contenu optimisé pour une campagne immobilière.
            Le contenu doit être en français et adapté au marché immobilier des Alpes-Maritimes.`
          },
          {
            role: "user",
            content: `Génère du contenu pour une campagne immobilière avec les caractéristiques suivantes:
            - Nom de la campagne: ${campaignName}
            - Plateforme: ${platform}
            - Audience cible: ${targetAudience}
            
            Format de réponse souhaité en JSON:
            {
              "seoTitle": "Titre optimisé SEO",
              "seoDescription": "Description optimisée SEO",
              "socialContent": "Contenu pour les réseaux sociaux",
              "imagePrompt": "Prompt pour générer l'image",
              "hashtags": ["liste", "des", "hashtags"],
              "keywords": ["mots", "clés", "importants"]
            }`
          }
        ],
        temperature: 0.7
      }),
    })

    const aiContent = await openAIResponse.json()
    const generatedContent = JSON.parse(aiContent.choices[0].message.content)

    // Générer l'image avec DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `${generatedContent.imagePrompt}. Style: Professional real estate photography, modern, bright, high-end.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    })

    const imageData = await imageResponse.json()
    generatedContent.imageUrl = imageData.data[0].url

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in campaign content generation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})