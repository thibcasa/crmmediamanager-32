import { supabase } from '@/lib/supabaseClient';
import { MarketingStrategy } from '@/types/marketing';

export class CampaignExecutor {
  async executeCampaign(strategy: MarketingStrategy): Promise<any> {
    const content = await this.createOptimizedContent(strategy);
    const schedule = await this.createPublicationSchedule(content);
    
    return this.launchAndMonitor({
      content,
      schedule,
      optimizationRules: strategy.approach.contentStrategy
    });
  }

  private async createOptimizedContent(strategy: MarketingStrategy): Promise<any[]> {
    const { data: content } = await supabase.functions.invoke('content-generator', {
      body: { strategy }
    });
    return this.optimizeContent(content);
  }

  private async createPublicationSchedule(content: any[]) {
    const { data: schedule } = await supabase.functions.invoke('schedule-generator', {
      body: { content }
    });
    return schedule;
  }

  private async launchAndMonitor(params: any) {
    const { data: campaign } = await supabase.functions.invoke('campaign-launcher', {
      body: params
    });
    return campaign;
  }

  private async optimizeContent(content: any) {
    const { data: optimized } = await supabase.functions.invoke('content-optimizer', {
      body: { content }
    });
    return optimized;
  }
}