import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Tu es une IA spécialisée dans l'immobilier de luxe sur la Côte d'Azur.
Ta mission est de générer du contenu marketing ciblé pour les propriétaires de biens immobiliers haut de gamme.
Concentre-toi sur :
- La valorisation des biens d'exception
- Les opportunités du marché local
- L'expertise immobilière de luxe
- La discrétion et le professionnalisme`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    console.log('Generating content for prompt:', prompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
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
    const metrics = {
      engagement: 85,
      clicks: 120,
      conversions: 3,
      roi: 250
    };

    return new Response(
      JSON.stringify({
        content: {
          type: 'social_post',
          text: generatedContent,
          platform: 'linkedin',
          targetAudience: 'Propriétaires de biens de luxe',
          metrics
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in content generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});