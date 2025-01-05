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
    const { action, subject, tone, targetAudience, context } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') || '',
    });

    if (action === 'optimize_title') {
      const prompt = `En tant qu'expert immobilier, génère 5 titres accrocheurs pour le sujet suivant:
        Sujet: ${subject}
        Ton: ${tone}
        Public cible: ${targetAudience}
        Contexte: ${JSON.stringify(context)}
        
        Les titres doivent:
        - Être optimisés pour LinkedIn
        - Inclure des chiffres quand c'est pertinent
        - Créer un sentiment d'urgence
        - Être en français
        - Être adaptés au marché immobilier de luxe
        
        Format: Retourne uniquement un tableau JSON de titres`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const titles = JSON.parse(completion.choices[0].message.content || '[]');

      return new Response(JSON.stringify({ titles }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'analyze_title') {
      const { title } = await req.json();
      
      const analysisPrompt = `Analyse ce titre LinkedIn pour l'immobilier:
        "${title}"
        
        Retourne un JSON avec:
        - seoScore: note /100
        - engagementPrediction: probabilité 0-1
        - suggestions: tableau de suggestions d'amélioration`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        temperature: 0.3,
      });

      const analysis = JSON.parse(completion.choices[0].message.content || '{}');

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});