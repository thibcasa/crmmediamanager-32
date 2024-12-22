import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, messageContent } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    console.log("Analyzing lead:", leadId);

    // Analyse du sentiment et de l'engagement
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un expert en analyse de leads immobiliers. Analyse le message et détermine le sentiment, le niveau d'engagement et suggère les prochaines actions."
          },
          {
            role: "user",
            content: messageContent
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'analyse du lead");
    }

    const analysisResult = await response.json();
    
    // Création du client Supabase
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Enregistrement de l'analyse
    const { error: insertError } = await supabaseClient
      .from("conversation_analytics")
      .insert({
        lead_id: leadId,
        message_content: messageContent,
        sentiment_score: 0.8, // À calculer en fonction de l'analyse
        engagement_score: 0.7, // À calculer en fonction de l'analyse
        next_actions: {
          suggestions: ["Envoyer un email de suivi", "Proposer un rendez-vous"],
          priority: "high"
        }
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erreur dans la fonction lead-analyzer:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});