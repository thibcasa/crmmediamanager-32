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
    const { objective, goalType, mandateGoal, frequency } = await req.json();
    
    console.log('Generating content for:', { objective, goalType, mandateGoal, frequency });

    const systemPrompt = `Tu es un expert en marketing immobilier de luxe sur la Côte d'Azur.
    Ton objectif est de générer une série de posts LinkedIn ciblés pour obtenir ${mandateGoal || 4} mandats 
    de vente par ${frequency || 'semaine'} dans les Alpes-Maritimes. Concentre-toi sur:
    - La valorisation des biens d'exception
    - Les opportunités du marché local
    - L'expertise immobilière de luxe
    - La confiance et la crédibilité professionnelle
    - Les témoignages et succès`;

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Génère une série de 5 posts LinkedIn optimisés pour obtenir ${mandateGoal || 4} mandats 
            de vente par ${frequency || 'semaine'} dans les Alpes-Maritimes. Format JSON avec:
            - Le contenu du post
            - Les hashtags pertinents
            - Le meilleur moment pour poster
            - Une description pour générer une image pertinente`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    const content = JSON.parse(aiResponse.choices[0].message.content);

    // Generate images for each post
    const postsWithImages = await Promise.all(content.posts.map(async (post: any) => {
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `${post.imagePrompt}. Style: Professional luxury real estate photography in French Riviera, bright, modern.`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }),
      });

      const imageData = await imageResponse.json();
      return {
        ...post,
        imageUrl: imageData.data[0].url
      };
    }));

    const result = {
      posts: postsWithImages,
      strategy: {
        postingFrequency: frequency || "weekly",
        targetMandates: mandateGoal || 4,
        bestTimes: ["09:00", "12:00", "17:00"],
        platforms: ["linkedin"],
        targetMetrics: {
          weeklyMandates: mandateGoal || 4,
          engagement: "5%",
          leads: mandateGoal * 5,
          conversion: "20%"
        }
      }
    };

    console.log('Generated content:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});