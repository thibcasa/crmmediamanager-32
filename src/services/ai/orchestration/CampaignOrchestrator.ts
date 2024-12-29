import { PersonaSelectionService } from './PersonaSelectionService';
import { ContentGenerationService } from '../ContentGenerationService';
import { StrategyOptimizationService } from '../StrategyOptimizationService';
import { supabase } from '@/lib/supabaseClient';

export class CampaignOrchestrator {
  static async orchestrateCampaign(objective: string) {
    try {
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);

      // 1. Sélection automatique du persona optimal
      const selectedPersona = await PersonaSelectionService.selectOptimalPersona(objective);

      // 2. Création de la campagne avec le persona sélectionné
      const { data: campaign, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne LinkedIn - ${new Date().toLocaleDateString()}`,
          platform: 'linkedin',
          status: 'draft',
          persona_id: selectedPersona.id,
          targeting_criteria: {
            location: "Nice, Alpes-Maritimes",
            interests: selectedPersona.interests,
            property_types: selectedPersona.property_types
          },
          content_strategy: {
            best_times: ["09:00", "12:00", "17:00"],
            post_types: ["image", "carousel"],
            content_themes: ["property_showcase", "market_insights"],
            posting_frequency: "daily"
          }
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 3. Génération du contenu optimisé
      const content = await ContentGenerationService.generateOptimizedContent({
        objective,
        persona: selectedPersona,
        platform: 'linkedin'
      });

      // 4. Configuration des automatisations
      await StrategyOptimizationService.setupAutomations({
        campaignId: campaign.id,
        objective,
        persona: selectedPersona
      });

      return {
        campaign,
        selectedPersona,
        content,
        nextSteps: [
          {
            type: 'content_generation',
            status: 'completed',
            details: 'Contenu généré avec succès'
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
}