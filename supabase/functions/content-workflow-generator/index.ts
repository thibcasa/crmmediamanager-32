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
    const { action, subject, tone, audience, keywords = [], contentType } = await req.json();
    console.log('Received request:', { action, subject, tone, audience, keywords, contentType });

    // Ensure keywords is always an array
    const keywordsArray = Array.isArray(keywords) ? keywords : [];

    const prompt = `En tant qu'expert en immobilier de luxe sur la Côte d'Azur, générez du contenu ${contentType || 'post'} 
    sur le sujet suivant : "${subject}".
    
    ${tone ? `Utilisez un ton ${tone}` : ''} ${audience ? `et ciblez spécifiquement ${audience}` : ''}.
    ${keywordsArray.length > 0 ? `Intégrez naturellement les mots-clés suivants : ${keywordsArray.join(', ')}.` : ''}
    
    Le contenu doit être structuré avec des titres (H1, H2) et des paragraphes.
    Concentrez-vous sur le marché immobilier de luxe des Alpes-Maritimes.
    Mettez en avant la valeur et le potentiel des biens immobiliers.`;

    console.log('Generated prompt:', prompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en immobilier de luxe sur la Côte d'Azur, spécialisé dans la création de contenu marketing ciblé."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        content: {
          type: contentType || 'post',
          text: generatedContent,
          platform: 'linkedin',
          targetAudience: audience || 'Propriétaires de biens de luxe',
          keywords: keywordsArray
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in content generation:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Une erreur est survenue lors de la génération du contenu",
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});