import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

interface MonitoringMetrics {
  moduleType: string;
  accuracy: number;
  confidence: number;
  userFeedback?: {
    isAccepted: boolean;
    modifications?: string[];
    comments?: string;
  };
}

export class AIMonitoringService {
  static async logMetrics(metrics: MonitoringMetrics) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('automation_logs').insert({
        user_id: user.id,
        action_type: 'ai_monitoring',
        description: `AI performance metrics for ${metrics.moduleType}`,
        metadata: {
          ...metrics,
          timestamp: new Date().toISOString()
        }
      });

      console.log('AI metrics logged:', metrics);
    } catch (error) {
      console.error('Error logging AI metrics:', error);
      toast({
        title: "Erreur de monitoring",
        description: "Impossible d'enregistrer les métriques de performance",
        variant: "destructive"
      });
    }
  }

  static async getFeedbackStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('automation_logs')
        .select('metadata')
        .eq('user_id', user.id)
        .eq('action_type', 'ai_monitoring')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      return this.analyzeStats(data);
    } catch (error) {
      console.error('Error getting feedback stats:', error);
      return null;
    }
  }

  private static analyzeStats(logs: any[]) {
    const stats = {
      totalSuggestions: logs.length,
      acceptanceRate: 0,
      commonModifications: new Map<string, number>(),
      modulePerformance: new Map<string, { accuracy: number, count: number }>()
    };

    logs.forEach(log => {
      const metrics = log.metadata;
      if (!metrics) return;

      // Analyze acceptance rate
      if (metrics.userFeedback?.isAccepted) {
        stats.acceptanceRate++;
      }

      // Track common modifications
      metrics.userFeedback?.modifications?.forEach((mod: string) => {
        stats.commonModifications.set(
          mod,
          (stats.commonModifications.get(mod) || 0) + 1
        );
      });

      // Track module performance
      const moduleStats = stats.modulePerformance.get(metrics.moduleType) || { accuracy: 0, count: 0 };
      moduleStats.accuracy += metrics.accuracy;
      moduleStats.count++;
      stats.modulePerformance.set(metrics.moduleType, moduleStats);
    });

    // Calculate averages
    stats.acceptanceRate = (stats.acceptanceRate / stats.totalSuggestions) * 100;
    stats.modulePerformance.forEach((value, key) => {
      value.accuracy = value.accuracy / value.count;
    });

    return stats;
  }
}