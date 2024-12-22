import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les campagnes actives
    const { data: campaigns, error: campaignError } = await supabaseClient
      .from('social_campaigns')
      .select(`
        *,
        conversation_analytics (
          sentiment_score,
          engagement_score,
          next_actions
        )
      `)
      .eq('status', 'active');

    if (campaignError) throw campaignError;

    console.log('Analyzing campaigns:', campaigns?.length);

    for (const campaign of campaigns || []) {
      // Calculer les scores moyens
      const analytics = campaign.conversation_analytics || [];
      const avgSentiment = analytics.reduce((acc, curr) => acc + (curr.sentiment_score || 0), 0) / (analytics.length || 1);
      const avgEngagement = analytics.reduce((acc, curr) => acc + (curr.engagement_score || 0), 0) / (analytics.length || 1);

      // Générer des recommandations avec l'IA
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: `Tu es un expert en marketing immobilier qui analyse les performances des campagnes.
              Sentiment moyen: ${avgSentiment}
              Engagement moyen: ${avgEngagement}
              Plateforme: ${campaign.platform}
              Message actuel: ${campaign.message_template}
              Critères de ciblage: ${JSON.stringify(campaign.targeting_criteria)}
              
              Propose des optimisations concrètes pour améliorer les performances.`
            }
          ],
          temperature: 0.7,
        }),
      });

      const aiData = await aiResponse.json();
      const recommendations = aiData.choices[0].message.content;

      // Mettre à jour la campagne avec les recommandations
      const { error: updateError } = await supabaseClient
        .from('social_campaigns')
        .update({
          ai_feedback: {
            last_analysis: new Date().toISOString(),
            metrics: {
              avg_sentiment: avgSentiment,
              avg_engagement: avgEngagement
            },
            recommendations,
            performance_status: avgEngagement > 0.7 ? 'good' : avgEngagement > 0.4 ? 'average' : 'needs_improvement'
          }
        })
        .eq('id', campaign.id);

      if (updateError) throw updateError;

      // Créer des automatisations basées sur les performances
      if (avgEngagement < 0.4) {
        // Créer une nouvelle automatisation pour améliorer l'engagement
        const { error: automationError } = await supabaseClient
          .from('automations')
          .insert({
            name: `Amélioration engagement - ${campaign.name}`,
            trigger_type: 'low_engagement',
            trigger_config: {
              campaign_id: campaign.id,
              threshold: 0.4
            },
            actions: [
              {
                type: 'generate_content',
                config: {
                  prompt: `Améliorer ce message: ${campaign.message_template}`,
                  platform: campaign.platform
                }
              },
              {
                type: 'update_targeting',
                config: {
                  criteria: campaign.targeting_criteria,
                  optimization: 'expand_reach'
                }
              }
            ],
            is_active: true,
            ai_enabled: true
          });

        if (automationError) throw automationError;
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Campaigns analyzed and optimized' }),
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