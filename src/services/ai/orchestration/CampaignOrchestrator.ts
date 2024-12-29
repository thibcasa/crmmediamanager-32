import { PersonaSelectionService } from './PersonaSelectionService';
import { ContentGenerationService } from '../ContentGenerationService';
import { StrategyOptimizationService } from '../StrategyOptimizationService';
import { supabase } from '@/lib/supabaseClient';

export class CampaignOrchestrator {
  static async orchestrateCampaign(objective: string) {
    try {
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);

      // 1. Analyse de l'objectif pour déterminer la meilleure stratégie multi-canal
      const platforms = ['linkedin', 'facebook', 'instagram'];
      const campaignResults = [];

      // 2. Sélection du persona optimal
      const selectedPersona = await PersonaSelectionService.selectOptimalPersona(objective);
      
      // 3. Pour chaque plateforme, créer une campagne adaptée
      for (const platform of platforms) {
        const strategy = await this.generatePlatformStrategy(platform, objective);
        const campaign = await this.createPlatformCampaign(platform, strategy, selectedPersona);
        campaignResults.push(campaign);
      }

      // 4. Créer les automatisations de suivi
      await StrategyOptimizationService.setupAutomations({
        campaignId: campaignResults[0].id, // Campaign principale (LinkedIn)
        objective,
        strategy: {
          targetMetrics: {
            daily_meetings: 1,
            engagement_rate: 0.05,
            conversion_rate: 0.02
          }
        }
      });

      return {
        campaigns: campaignResults,
        selectedPersona,
        nextSteps: [
          {
            type: 'content_generation',
            status: 'completed',
            details: 'Contenu généré pour chaque plateforme'
          },
          {
            type: 'automation_setup',
            status: 'completed',
            details: 'Automatisations configurées'
          }
        ]
      };
    } catch (error) {
      console.error('Erreur dans l\'orchestration:', error);
      throw error;
    }
  }

  private static async generatePlatformStrategy(platform: string, objective: string) {
    const platformStrategies = {
      linkedin: {
        contentType: 'educational',
        format: 'article',
        frequency: 'daily',
        bestTimes: ['09:00', '12:00', '17:00'],
        approach: 'thought_leadership'
      },
      facebook: {
        contentType: 'conversion',
        format: 'form',
        frequency: 'daily',
        bestTimes: ['10:00', '15:00', '19:00'],
        approach: 'direct_response'
      },
      instagram: {
        contentType: 'visual',
        format: 'reel',
        frequency: 'daily',
        bestTimes: ['11:00', '14:00', '20:00'],
        approach: 'storytelling'
      }
    };

    return platformStrategies[platform];
  }

  private static async createPlatformCampaign(platform: string, strategy: any, persona: any) {
    const { data: campaign, error: campaignError } = await supabase
      .from('social_campaigns')
      .insert({
        name: `Campagne ${platform} - Estimations immobilières`,
        platform,
        status: 'draft',
        persona_id: persona.id,
        targeting_criteria: {
          location: "Nice, Alpes-Maritimes",
          interests: persona.interests,
          property_types: persona.property_types
        },
        content_strategy: {
          content_type: strategy.contentType,
          format: strategy.format,
          frequency: strategy.frequency,
          best_times: strategy.bestTimes,
          approach: strategy.approach
        },
        target_metrics: {
          daily_meetings: 1,
          engagement_rate: 0.05,
          conversion_rate: 0.02
        }
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Générer le contenu adapté à la plateforme
    const content = await ContentGenerationService.generateOptimizedContent({
      objective,
      persona,
      platform,
      strategy
    });

    // Mettre à jour la campagne avec le contenu
    await supabase
      .from('social_campaigns')
      .update({
        message_template: content.template,
        posts: content.posts
      })
      .eq('id', campaign.id);

    return campaign;
  }
}