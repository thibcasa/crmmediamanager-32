import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Vérifier la clé API OpenAI
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY non configurée");
      throw new Error("Configuration OpenAI manquante");
    }

    const { type = 'social', prompt, platform = 'linkedin', targetAudience, tone } = await req.json();
    
    console.log("Début de la génération de contenu:", {
      type,
      platform,
      targetAudience,
      hasPrompt: !!prompt
    });

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
            content: `Tu es un expert en immobilier spécialisé dans la création de contenu pour le marché des Alpes-Maritimes.
            Ton objectif est de créer du contenu pertinent pour les propriétaires de biens immobiliers.`
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
    
    // Retourner une réponse d'erreur plus détaillée
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});