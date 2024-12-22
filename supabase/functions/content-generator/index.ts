import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY manquante");
      throw new Error("Configuration OpenAI manquante");
    }

    const { prompt, type = 'social', platform = 'linkedin' } = await req.json();
    
    console.log("Génération de contenu pour:", { type, platform, prompt: prompt.substring(0, 100) + "..." });

    const systemPrompt = `Tu es un expert en immobilier spécialisé dans la création de contenu pour le marché des Alpes-Maritimes.
    Ton objectif est de créer du contenu pertinent et professionnel pour les propriétaires de biens immobiliers.
    
    Pour chaque demande, tu dois :
    1. Analyser les tendances du marché local
    2. Créer du contenu adapté à la plateforme ${platform}
    3. Suggérer des actions de prospection
    4. Proposer des critères de ciblage précis
    
    Format de réponse :
    1. Analyse du marché
    2. Contenu à publier
    3. Critères de ciblage
    4. Actions recommandées`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur OpenAI:", errorData);
      throw new Error(`Erreur OpenAI: ${errorData}`);
    }

    const data = await response.json();
    console.log("Contenu généré avec succès");

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erreur détaillée:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});