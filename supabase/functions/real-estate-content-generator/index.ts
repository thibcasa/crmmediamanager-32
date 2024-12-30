import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyType, location, targetAudience } = await req.json();
    
    console.log('Generating content for:', { propertyType, location, targetAudience });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en marketing immobilier de luxe sur la Côte d'Azur.
            Ton objectif est de générer du contenu marketing ciblé pour les propriétaires
            de biens immobiliers haut de gamme dans les Alpes-Maritimes.
            Concentre-toi sur la valorisation des biens d'exception, les opportunités
            du marché local et l'expertise immobilière de luxe.`
          },
          {
            role: 'user',
            content: `Génère un post LinkedIn professionnel pour un bien immobilier avec les caractéristiques suivantes:
            - Type de bien: ${propertyType}
            - Localisation: ${location}
            - Cible: ${targetAudience}
            
            Format de réponse souhaité en JSON:
            {
              "title": "Titre accrocheur",
              "content": "Contenu du post",
              "hashtags": ["liste", "des", "hashtags"],
              "callToAction": "Appel à l'action",
              "imagePrompt": "Description pour la génération d'image",
              "suggestedTiming": "Meilleur moment pour poster"
            }`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const content = JSON.parse(aiResponse.choices[0].message.content);

    // Générer l'image avec DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `${content.imagePrompt}. Style: Professional real estate photography, luxury property in French Riviera, bright, modern.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    });

    const imageData = await imageResponse.json();
    content.imageUrl = imageData.data[0].url;

    // Log the generated content
    console.log('Generated content:', content);

    return new Response(
      JSON.stringify(content),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in real estate content generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});