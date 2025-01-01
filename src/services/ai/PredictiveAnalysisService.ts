import { supabase } from '@/lib/supabaseClient';

interface PredictionResponse {
  conversion?: {
    rate?: number;
  };
  roi?: {
    predicted?: number;
  };
  marketTrends?: {
    demandIndex?: number;
  };
  recommendations?: string[];
  insights?: Array<{
    category: string;
    description: string;
    impact: number;
    confidence: number;
  }>;
}

export class PredictiveAnalysisService {
  static async analyzeCampaignPerformance(campaignId: string): Promise<PredictionResponse> {
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

      return data as PredictionResponse;
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      throw error;
    }
  }

  static async generateOptimizationSuggestions(campaignId: string): Promise<PredictionResponse> {
    try {
      console.log('Generating optimization suggestions for campaign:', campaignId);
      
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

      if (!data) {
        throw new Error('No suggestions returned from predictive analysis');
      }

      return data as PredictionResponse;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw error;
    }
  }
}