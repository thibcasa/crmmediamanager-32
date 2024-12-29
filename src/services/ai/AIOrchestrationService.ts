import { CampaignAnalysisService } from './CampaignAnalysisService';
import { ContentGenerationService } from './ContentGenerationService';
import { StrategyOptimizationService } from './StrategyOptimizationService';
import { supabase } from '@/lib/supabaseClient';

export class AIOrchestrationService {
  static async orchestrateCampaign(campaignObjective: {
    goal: string;
    motivation: string;
    expectedResults: {
      engagement: number;
      leads: number;
      roi: number;
    };
    persona: {
      id: string;
      characteristics: Record<string, any>;
    };
    timing: {
      startDate: Date;
      frequency: string;
      duration: number;
    };
    channels: string[];
  }) {
    try {
      console.log('Starting AI orchestration with objective:', campaignObjective);

      // 1. Analyser l'objectif et définir la stratégie
      const strategy = await CampaignAnalysisService.analyzeObjective(campaignObjective);
      
      // 2. Créer la campagne avec la stratégie optimisée
      const { data: campaign, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${campaignObjective.channels[0]} - ${new Date().toLocaleDateString()}`,
          platform: campaignObjective.channels[0],
          status: 'draft',
          targeting_criteria: strategy.targeting,
          content_strategy: strategy.content,
          schedule: strategy.timing,
          persona_id: campaignObjective.persona.id,
          target_metrics: campaignObjective.expectedResults
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 3. Générer le contenu optimisé
      const content = await ContentGenerationService.generateOptimizedContent({
        objective: campaignObjective.goal,
        persona: campaignObjective.persona,
        platform: campaignObjective.channels[0],
        strategy: strategy.content
      });

      // 4. Mettre à jour la campagne avec le contenu
      await supabase
        .from('social_campaigns')
        .update({
          posts: content.posts,
          message_template: content.template
        })
        .eq('id', campaign.id);

      // 5. Configurer les automatisations de suivi et d'optimisation
      await StrategyOptimizationService.setupAutomations({
        campaignId: campaign.id,
        objective: campaignObjective,
        strategy
      });

      return {
        campaign,
        strategy,
        content,
        nextSteps: strategy.recommendations
      };

    } catch (error) {
      console.error('Error in AI orchestration:', error);
      throw error;
    }
  }
}