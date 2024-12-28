import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, iterationCount } = await req.json();
    console.log('Analyzing campaign:', { message, iterationCount });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Simuler l'analyse de campagne
    const campaignAnalysis = {
      engagement: Math.random() * 0.4 + 0.2,
      costPerLead: Math.floor(Math.random() * 30) + 10,
      roi: Math.random() * 3 + 1,
      estimatedLeads: Math.floor(Math.random() * 50) + 10,
      campaignDetails: {
        creatives: [
          {
            type: 'image',
            content: 'Villa de luxe avec vue mer',
            performance: 0.8
          },
          {
            type: 'text',
            content: 'Investissement immobilier premium',
            performance: 0.7
          }
        ],
        content: {
          messages: [
            "Découvrez nos biens d'exception",
            "Investissez dans l'immobilier de luxe"
          ],
          headlines: [
            "Villas de prestige - Alpes-Maritimes",
            "Propriétés exclusives - French Riviera"
          ]
        },
        workflow: {
          steps: [
            {
              name: "Génération de contenu",
              status: "completed",
              metrics: { quality: 0.85 }
            },
            {
              name: "Test A/B",
              status: "in_progress",
              metrics: { conversionRate: 0.12 }
            }
          ]
        }
      }
    };

    // Enregistrer les résultats dans error_logs pour le monitoring
    await supabaseClient.from('error_logs').insert({
      error_type: 'CAMPAIGN_ANALYSIS',
      error_message: `Analyse de campagne - Itération ${iterationCount}`,
      component: 'campaign-analyzer',
      success: true,
      correction_applied: 'Optimisations IA appliquées',
    });

    console.log('Analysis completed:', campaignAnalysis);

    return new Response(
      JSON.stringify(campaignAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in campaign analysis:', error);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient.from('error_logs').insert({
      error_type: 'CAMPAIGN_ANALYSIS_ERROR',
      error_message: error.message,
      component: 'campaign-analyzer',
      success: false
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});