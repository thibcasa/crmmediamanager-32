import { PersonaSelectionService } from './PersonaSelectionService';
import { StrategyOptimizationService } from '../StrategyOptimizationService';
import { PlatformStrategies } from './strategies/PlatformStrategies';
import { CampaignCreator } from './campaign/CampaignCreator';

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
        const strategy = await PlatformStrategies.generatePlatformStrategy(platform);
        const campaign = await CampaignCreator.createPlatformCampaign(
          platform, 
          strategy, 
          selectedPersona, 
          objective
        );
        campaignResults.push(campaign);
      }

      // 4. Créer les automatisations de suivi
      await StrategyOptimizationService.setupAutomations({
        campaignId: campaignResults[0].id,
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
}