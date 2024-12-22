import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContentRequest {
  prompt: string;
  type: 'social' | 'email' | 'blog';
  platform?: string;
  targetAudience?: string;
  tone?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type, platform, targetAudience, tone }: ContentRequest = await req.json();

    console.log("Generating content for:", { type, platform, targetAudience });

    const systemPrompt = `Tu es un expert en immobilier spécialisé dans la création de contenu ${type} 
    pour le marché immobilier des Alpes-Maritimes, particulièrement Nice et ses environs. 
    
    Ton objectif est de créer du contenu pertinent pour les cadres de 35-65 ans qui pourraient 
    être intéressés par la vente de leur bien immobilier.
    
    Pour chaque réponse :
    1. Analyse les tendances immobilières récentes de Nice
    2. Crée du contenu LinkedIn adapté à notre persona cible
    3. Suggère des actions de prospection personnalisées
    4. Propose des critères de ciblage LinkedIn précis
    
    Persona cible :
    - Cadres 35-65 ans
    - Basés à Nice ou alentours
    - Propriétaires potentiels
    - Actifs sur LinkedIn`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `
              Crée du contenu ${type} avec les caractéristiques suivantes:
              - Plateforme: ${platform || 'LinkedIn'}
              - Public cible: ${targetAudience || 'cadres propriétaires à Nice'}
              - Ton: ${tone || 'professionnel et confiant'}
              
              Prompt spécifique: ${prompt}
              
              Format de réponse souhaité:
              1. Analyse du marché
              2. Contenu à publier
              3. Critères de ciblage LinkedIn
              4. Stratégie de prospection
            `
          }
        ],
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return new Response(
        JSON.stringify({ content: data.choices[0].message.content }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      throw new Error("Erreur lors de la génération du contenu");
    }
  } catch (error) {
    console.error("Erreur dans la fonction content-generator:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});