import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

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
    console.log('Received request:', { objective, goalType, mandateGoal, frequency });

    if (!objective) {
      throw new Error('Objective is required');
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') || '',
    });

    // Generate content strategy based on objective
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Vous êtes un expert en marketing immobilier sur la Côte d'Azur. 
                   Générez une stratégie de contenu optimisée pour atteindre les objectifs donnés.`
        },
        {
          role: "user",
          content: `Créez une stratégie de contenu pour : ${objective}
                   Type d'objectif : ${goalType}
                   ${mandateGoal ? `Objectif de mandats : ${mandateGoal} par ${frequency}` : ''}
                   
                   Retournez un JSON avec:
                   - template: le modèle de message
                   - posts: tableau de posts optimisés
                   - seoTitles: suggestions de titres SEO
                   - hashtags: hashtags pertinents`
        }
      ]
    });

    if (!completion.choices[0].message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the JSON response
    const strategy = JSON.parse(completion.choices[0].message.content);

    return new Response(JSON.stringify(strategy), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-workflow-generator:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});