import { supabase } from '@/lib/supabaseClient';

export class PredictiveAnalysisService {
  static async analyzeCampaignPerformance(campaignId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('predictive-analysis', {
        body: { 
          campaignId,
          action: 'analyze_performance'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from predictive analysis');
      }

      return data;
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      throw error;
    }
  }

  static async generateOptimizationSuggestions(campaignId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('predictive-analysis', {
        body: { 
          campaignId,
          action: 'generate_suggestions'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw error;
    }
  }
}