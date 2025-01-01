import { supabase } from '@/lib/supabaseClient';

export class PredictiveAnalysisService {
  static async analyzeCampaignPerformance(campaignId: string) {
    try {
      console.log('Calling predictive analysis for campaign:', campaignId);
      
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

      // Validate the data structure
      if (!data.conversion?.rate || !data.roi?.predicted || !data.marketTrends?.demandIndex) {
        console.error('Invalid data structure received:', data);
        throw new Error('Invalid prediction data structure');
      }

      return data;
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      throw error;
    }
  }
}