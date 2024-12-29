import { supabase } from '@/lib/supabaseClient';

export class PredictiveAnalysisService {
  static async analyzeCampaignPerformance(campaignId: string) {
    try {
      const { data: predictions } = await supabase.functions.invoke('predictive-analysis', {
        body: { 
          campaignId,
          action: 'analyze_performance'
        }
      });

      return predictions;
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      throw error;
    }
  }

  static async generateOptimizationSuggestions(campaignId: string) {
    try {
      const { data: suggestions } = await supabase.functions.invoke('predictive-analysis', {
        body: { 
          campaignId,
          action: 'generate_suggestions'
        }
      });

      return suggestions;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw error;
    }
  }
}