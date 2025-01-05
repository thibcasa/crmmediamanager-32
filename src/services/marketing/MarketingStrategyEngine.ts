import { supabase } from '@/lib/supabaseClient';
import { BusinessObjective, MarketingStrategy, MarketingApproach } from '@/types/marketing';

export class MarketingStrategyEngine {
  async createStrategy(objective: BusinessObjective): Promise<MarketingStrategy> {
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

    return {
      objective,
      approach,
      actionPlan,
      expectedResults: {
        mandates: objective.target,
        leads: objective.target * 3,
        engagement: 0.1,
        roi: 2.5
      }
    };
  }

  private async analyzeMarketContext(objective: BusinessObjective) {
    const { data: marketData } = await supabase.functions.invoke('market-analyzer', {
      body: { objective }
    });
    return marketData;
  }

  private async getSuccessfulStrategies() {
    const { data: strategies } = await supabase
      .from('marketing_strategies')
      .select('*')
      .eq('status', 'successful');
    return strategies;
  }

  private async determineOptimalApproach(context: any): Promise<MarketingApproach> {
    const { data: approach } = await supabase.functions.invoke('strategy-generator', {
      body: context
    });
    return approach;
  }

  private async createActionPlan(params: any) {
    const { data: plan } = await supabase.functions.invoke('action-plan-generator', {
      body: params
    });
    return plan;
  }
}