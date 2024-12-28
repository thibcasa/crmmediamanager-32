import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Content generator function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    const { type = 'social', prompt, platform = 'linkedin', options = {} } = await req.json();
    
    console.log(`Generating ${type} content for ${platform}`);

    const systemPrompt = `Tu es un expert en stratégie immobilière sur ${platform}. 
    Ton objectif est de créer du contenu pour atteindre et engager des propriétaires immobiliers dans les Alpes-Maritimes.
    
    Pour chaque demande, tu dois :
    1. Analyser l'objectif de la campagne
    2. Créer du contenu adapté à ${platform}
    3. Suggérer des visuels pertinents
    4. Proposer une stratégie de ciblage précise
    5. Définir des KPIs et objectifs mesurables
    
    Ton contenu doit être professionnel, informatif et adapté au marché immobilier premium des Alpes-Maritimes.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Erreur lors de la communication avec l\'API OpenAI');
    }

    const data = await response.json();
    console.log('Content generated successfully');

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content-generator function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de la génération du contenu",
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});