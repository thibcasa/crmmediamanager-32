import { supabase } from '@/lib/supabaseClient';

export class PerformanceOptimizer {
  async monitorAndOptimize(campaign: any): Promise<void> {
    const monitor = setInterval(async () => {
      const performance = await this.analyzePerformance(campaign);
      
      if (performance.belowTarget) {
        const improvements = await this.generateImprovements({
          campaign,
          performance,
          objective: campaign.objective
        });

        await this.applyImprovements(campaign, improvements);
        await this.notifyUser(improvements);
      }
    }, 3600000); // Check every hour

    return () => clearInterval(monitor);
  }

  private async analyzePerformance(campaign: any) {
    const { data: performance } = await supabase.functions.invoke('performance-analyzer', {
      body: { campaign }
    });
    return performance;
  }

  private async generateImprovements(context: any) {
    const { data: improvements } = await supabase.functions.invoke('improvement-generator', {
      body: context
    });
    return improvements;
  }

  private async applyImprovements(campaign: any, improvements: any[]) {
    const { data: result } = await supabase.functions.invoke('improvement-applier', {
      body: { campaign, improvements }
    });
    return result;
  }

  private async notifyUser(improvements: any[]) {
    const { data: notification } = await supabase.functions.invoke('user-notifier', {
      body: { improvements }
    });
    return notification;
  }
}