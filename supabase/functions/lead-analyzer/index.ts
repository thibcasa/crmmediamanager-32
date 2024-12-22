import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId, messageContent } = await req.json();

    console.log("Analyzing lead:", leadId);

    // Analyse du sentiment avec OpenAI
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
            content: "Tu es un expert en analyse de leads immobiliers. Analyse le message et détermine le sentiment (positif, négatif, neutre) et suggère les prochaines actions à entreprendre."
          },
          {
            role: "user",
            content: messageContent
          }
        ]
      }),
    });

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;

    // Calcul des scores
    const sentimentScore = analysis.includes("positif") ? 0.8 : analysis.includes("négatif") ? 0.2 : 0.5;
    const engagementScore = messageContent.length > 200 ? 0.8 : 0.4;

    // Sauvegarde de l'analyse
    const { data, error } = await supabase
      .from("conversation_analytics")
      .insert([
        {
          lead_id: leadId,
          message_content: messageContent,
          sentiment_score: sentimentScore,
          engagement_score: engagementScore,
          next_actions: { suggestions: analysis },
          analyzed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
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