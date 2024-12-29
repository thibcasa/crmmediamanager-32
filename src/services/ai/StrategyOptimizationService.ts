import { supabase } from '@/lib/supabaseClient';

export class StrategyOptimizationService {
  static async generateStrategy(objective: string, persona: any) {
    try {
      const { data: aiAnalysis } = await supabase.functions.invoke('content-analyzer', {
        body: { 
          content: objective,
          persona_id: persona.id,
          type: 'strategy_generation'
        }
      });

      return {
        contentTypes: aiAnalysis.recommended_content_types,
        postingFrequency: aiAnalysis.recommended_frequency,
        targetMetrics: aiAnalysis.target_metrics,
        contentThemes: aiAnalysis.content_themes
      };
    } catch (error) {
      console.error('Erreur lors de la génération de la stratégie:', error);
      throw error;
    }
  }

  static async setupAutomations({ campaignId, objective, strategy }: {
    campaignId: string;
    objective: any;
    strategy: any;
  }) {
    try {
      const { data: automation, error } = await supabase
        .from('automations')
        .insert({
          name: `Automatisation - Campagne ${campaignId}`,
          trigger_type: 'campaign_engagement',
          trigger_config: {
            campaign_id: campaignId,
            metrics: ['engagement', 'leads', 'conversions'],
            thresholds: strategy.targetMetrics
          },
          actions: [
            {
              type: 'analyze_performance',
              config: {
                metrics: ['engagement', 'conversion', 'roi'],
                frequency: strategy.postingFrequency
              }
            },
            {
              type: 'generate_content',
              config: {
                type: 'social',
                content_types: strategy.contentTypes,
                themes: strategy.contentThemes
              }
            }
          ],
          is_active: true,
          ai_enabled: true
        })
        .select()
        .single();

      if (error) throw error;
      return automation;
    } catch (error) {
      console.error('Erreur lors de la configuration des automatisations:', error);
      throw error;
    }
  }
}