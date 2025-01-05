import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

interface Campaign {
  id: string;
  objective: {
    type: string;
    target: number;
  };
  metrics?: {
    engagement_rate?: number;
    conversion_rate?: number;
    roi?: number;
  };
}

interface PerformanceMetrics {
  belowTarget: boolean;
  currentMetrics: {
    engagement_rate: number;
    conversion_rate: number;
    roi: number;
  };
}

interface BusinessObjective {
  type: string;
  target: number;
  timeline: string;
}

interface Improvement {
  type: string;
  description: string;
  expectedImpact: {
    metric: string;
    increase: number;
  };
}

interface OptimizationContext {
  campaign: Campaign;
  performance: PerformanceMetrics;
  objective: BusinessObjective;
}

export class PerformanceOptimizer {
  private monitorInterval: NodeJS.Timeout | null = null;

  async monitorAndOptimize(campaign: Campaign): Promise<void> {
    const checkInterval = 300000; // 5 minutes in milliseconds
    
    // Clear any existing interval
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    
    this.monitorInterval = setInterval(async () => {
      try {
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
      } catch (error) {
        console.error('Error in performance optimization:', error);
        toast({
          title: "Erreur d'optimisation",
          description: "Une erreur est survenue lors de l'optimisation de la campagne",
          variant: "destructive"
        });
      }
    }, checkInterval);

    // Clear the interval after 24 hours
    setTimeout(() => {
      if (this.monitorInterval) {
        clearInterval(this.monitorInterval);
        this.monitorInterval = null;
      }
    }, 86400000);
  }

  private async analyzePerformance(campaign: Campaign): Promise<PerformanceMetrics> {
    const { data: metrics } = await supabase
      .from('metrics')
      .select('*')
      .eq('campaign_id', campaign.id)
      .single();

    const currentMetrics = {
      engagement_rate: metrics?.engagement_rate || 0,
      conversion_rate: metrics?.conversion_rate || 0,
      roi: metrics?.roi || 0
    };

    const belowTarget = currentMetrics.engagement_rate < (campaign.metrics?.engagement_rate || 0) ||
                       currentMetrics.conversion_rate < (campaign.metrics?.conversion_rate || 0) ||
                       currentMetrics.roi < (campaign.metrics?.roi || 0);

    return {
      belowTarget,
      currentMetrics
    };
  }

  private async generateImprovements(context: OptimizationContext): Promise<Improvement[]> {
    const improvements: Improvement[] = [];
    const { campaign, performance } = context;

    if (performance.currentMetrics.engagement_rate < (campaign.metrics?.engagement_rate || 0)) {
      improvements.push({
        type: 'engagement',
        description: 'Augmenter la fréquence des posts et optimiser les heures de publication',
        expectedImpact: {
          metric: 'engagement_rate',
          increase: 0.15
        }
      });
    }

    if (performance.currentMetrics.conversion_rate < (campaign.metrics?.conversion_rate || 0)) {
      improvements.push({
        type: 'conversion',
        description: 'Optimiser les call-to-action et le ciblage des audiences',
        expectedImpact: {
          metric: 'conversion_rate',
          increase: 0.1
        }
      });
    }

    return improvements;
  }

  private async applyImprovements(campaign: Campaign, improvements: Improvement[]): Promise<void> {
    const { data, error } = await supabase
      .from('social_campaigns')
      .update({
        optimization_cycles: improvements,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaign.id);

    if (error) {
      console.error('Error applying improvements:', error);
      throw error;
    }
  }

  private async notifyUser(improvements: Improvement[]): Promise<void> {
    improvements.forEach(improvement => {
      toast({
        title: "Optimisation appliquée",
        description: improvement.description,
      });
    });
  }
}