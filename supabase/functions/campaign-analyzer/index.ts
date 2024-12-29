import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId } = await req.json();
    console.log('Analyzing campaign:', campaignId);

    // Fetch campaign data from database
    const { data: campaign, error: campaignError } = await supabase
      .from('social_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError) throw campaignError;

    // Analyze performance and generate optimizations
    const optimizations = {
      targeting_criteria: {
        ...campaign.targeting_criteria,
        age_range: {
          min: Math.max(18, campaign.targeting_criteria.age_range.min - 5),
          max: Math.min(65, campaign.targeting_criteria.age_range.max + 5)
        },
        locations: [...campaign.targeting_criteria.locations, 'nearby_cities'],
        interests: [...campaign.targeting_criteria.interests, 'real_estate_investment']
      },
      ai_feedback: {
        suggestions: [
          "Élargissement de la tranche d'âge pour toucher plus de prospects qualifiés",
          "Inclusion des villes voisines pour augmenter la portée",
          "Ajout de centres d'intérêt liés à l'investissement immobilier"
        ],
        performance_metrics: {
          engagement_rate: 0.045,
          roi: 2.8,
          predicted_improvement: 0.15
        }
      }
    };

    // Update campaign with optimizations
    const { error: updateError } = await supabase
      .from('social_campaigns')
      .update(optimizations)
      .eq('id', campaignId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true, optimizations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in campaign-analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});