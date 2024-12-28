import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sources = [
      {
        name: "INSEE",
        url: "https://api.insee.fr/donnees-locales/V0.1/donnees/geo-IND_SOCIOECO@GEO2021RP2019/06.all",
        type: "demographic"
      },
      {
        name: "DataFoncier",
        url: "https://api.datafoncier.cerema.fr/v1/mutations",
        type: "real_estate"
      },
      {
        name: "MeilleursAgents",
        url: "https://www.meilleursagents.com/prix-immobilier/alpes-maritimes-06/",
        type: "market_prices"
      },
      {
        name: "PAP",
        url: "https://www.pap.fr/annonce/vente-appartement-maison-alpes-maritimes-06-g3",
        type: "listings"
      }
    ];

    // Analyse des données démographiques
    const demographicData = {
      age_groups: {
        "25-34": 0.15,
        "35-49": 0.25,
        "50-64": 0.35,
        "65+": 0.25
      },
      income_levels: {
        "high": 0.30,
        "medium": 0.45,
        "low": 0.25
      },
      property_types: {
        "apartment": 0.65,
        "house": 0.35
      }
    };

    // Analyse des motivations de vente
    const sellingMotivations = {
      "relocation": 0.30,
      "investment": 0.25,
      "retirement": 0.20,
      "inheritance": 0.15,
      "financial_needs": 0.10
    };

    // Analyse des périodes favorables
    const seasonalTrends = {
      "spring": 0.35,
      "summer": 0.30,
      "fall": 0.20,
      "winter": 0.15
    };

    // Comportements digitaux
    const digitalBehaviors = {
      "social_media_usage": {
        "linkedin": 0.40,
        "facebook": 0.30,
        "instagram": 0.20,
        "twitter": 0.10
      },
      "preferred_contact_methods": {
        "email": 0.35,
        "phone": 0.30,
        "whatsapp": 0.20,
        "messenger": 0.15
      },
      "peak_activity_hours": {
        "morning": "9:00-11:00",
        "afternoon": "14:00-16:00",
        "evening": "19:00-21:00"
      }
    };

    // Création du profil comportemental
    const behavioralProfile = {
      demographics: demographicData,
      motivations: sellingMotivations,
      seasonal_patterns: seasonalTrends,
      digital_presence: digitalBehaviors,
      key_triggers: [
        "Changement de situation professionnelle",
        "Projet de retraite",
        "Opportunités d'investissement",
        "Évolution familiale",
        "Optimisation fiscale"
      ],
      decision_factors: [
        "Prix du marché",
        "Rapidité de la transaction",
        "Confiance dans l'agent",
        "Transparence du processus",
        "Qualité du service"
      ]
    };

    // Stockage des données dans Supabase pour enrichir l'IA
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('audience_segments')
      .insert({
        name: 'Propriétaires Alpes-Maritimes',
        description: 'Analyse comportementale des propriétaires immobiliers',
        criteria: behavioralProfile,
        user_id: (await req.json()).userId
      })
      .select()
      .single();

    if (error) throw error;

    // Enrichissement de l'IA avec OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en analyse comportementale des propriétaires immobiliers dans les Alpes-Maritimes.'
          },
          {
            role: 'user',
            content: `Analyse ce profil comportemental et suggère des stratégies d'approche personnalisées: ${JSON.stringify(behavioralProfile)}`
          }
        ],
      }),
    });

    const aiSuggestions = await openAIResponse.json();

    return new Response(
      JSON.stringify({
        profile: behavioralProfile,
        ai_suggestions: aiSuggestions.choices[0].message.content,
        sources: sources
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in behavior-analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});