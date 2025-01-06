import { supabase } from '@/lib/supabaseClient';
import { BusinessObjective, MarketingStrategy, MarketingApproach } from '@/types/marketing';

export class MarketingStrategyEngine {
  async createStrategy(objective: BusinessObjective): Promise<MarketingStrategy> {
    try {
      const marketAnalysis = await this.analyzeMarketContext(objective);
      const approach = await this.determineOptimalApproach({
        objective,
        marketAnalysis,
        historicalSuccess: await this.getSuccessfulStrategies()
      });

      const actionPlan = await this.createActionPlan({
        approach,
        timeline: objective.timeline,
        resources: { budget: 1000, platforms: ['linkedin'], team: ['marketing'] }
      });

      // Ensure we have default values for all required properties
      return {
        objective: {
          target: objective.target || 0,
          timeline: objective.timeline || '1 month',
          type: objective.type || 'mandate_generation'
        },
        approach: {
          channels: approach?.channels || ['linkedin'],
          targetAudience: approach?.targetAudience || 'Propriétaires immobiliers',
          keyMessages: approach?.keyMessages || ['Message par défaut'],
          contentStrategy: approach?.contentStrategy || {
            postTypes: ['post'],
            frequency: 'weekly',
            themes: ['immobilier'],
            tone: 'professionnel'
          }
        },
        actionPlan: {
          steps: actionPlan?.steps || [{
            type: 'initial',
            description: 'Définition de la stratégie',
            deadline: new Date().toISOString(),
            status: 'pending'
          }],
          timeline: actionPlan?.timeline || {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            milestones: []
          },
          resources: actionPlan?.resources || {
            budget: 1000,
            platforms: ['linkedin'],
            team: ['marketing']
          }
        },
        expectedResults: {
          mandates: objective.target || 0,
          leads: (objective.target || 0) * 3,
          engagement: 0.1,
          roi: 2.5
        }
      };
    } catch (error) {
      console.error('Error in createStrategy:', error);
      // Return a default strategy in case of error
      return this.getDefaultStrategy(objective);
    }
  }

  private getDefaultStrategy(objective: BusinessObjective): MarketingStrategy {
    return {
      objective: {
        target: objective.target || 0,
        timeline: objective.timeline || '1 month',
        type: objective.type || 'mandate_generation'
      },
      approach: {
        channels: ['linkedin'],
        targetAudience: 'Propriétaires immobiliers',
        keyMessages: ['Stratégie en cours de génération...'],
        contentStrategy: {
          postTypes: ['post'],
          frequency: 'weekly',
          themes: ['immobilier'],
          tone: 'professionnel'
        }
      },
      actionPlan: {
        steps: [{
          type: 'initial',
          description: 'Définition de la stratégie',
          deadline: new Date().toISOString(),
          status: 'pending'
        }],
        timeline: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          milestones: []
        },
        resources: {
          budget: 1000,
          platforms: ['linkedin'],
          team: ['marketing']
        }
      },
      expectedResults: {
        mandates: objective.target || 0,
        leads: (objective.target || 0) * 3,
        engagement: 0.1,
        roi: 2.5
      }
    };
  }

  private async analyzeMarketContext(objective: BusinessObjective) {
    try {
      const { data: marketData } = await supabase.functions.invoke('market-analyzer', {
        body: { objective }
      });
      return marketData;
    } catch (error) {
      console.error('Error analyzing market context:', error);
      return null;
    }
  }

  private async getSuccessfulStrategies() {
    try {
      const { data: strategies } = await supabase
        .from('marketing_strategies')
        .select('*')
        .eq('status', 'successful');
      return strategies;
    } catch (error) {
      console.error('Error getting successful strategies:', error);
      return [];
    }
  }

  private async determineOptimalApproach(context: any): Promise<MarketingApproach> {
    try {
      const { data: approach } = await supabase.functions.invoke('strategy-generator', {
        body: context
      });
      return approach;
    } catch (error) {
      console.error('Error determining optimal approach:', error);
      return {
        channels: ['linkedin'],
        targetAudience: 'Propriétaires immobiliers',
        keyMessages: ['Stratégie en cours de génération...'],
        contentStrategy: {
          postTypes: ['post'],
          frequency: 'weekly',
          themes: ['immobilier'],
          tone: 'professionnel'
        }
      };
    }
  }

  private async createActionPlan(params: any) {
    try {
      const { data: plan } = await supabase.functions.invoke('action-plan-generator', {
        body: params
      });
      return plan;
    } catch (error) {
      console.error('Error creating action plan:', error);
      return null;
    }
  }
}