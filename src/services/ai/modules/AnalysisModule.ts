import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class AnalysisModule implements AIModule {
  async execute(input: { data: any; metrics: any }): Promise<ModuleResult> {
    try {
      console.log('Executing analysis module with input:', input);
      
      const { data, error } = await supabase.functions.invoke('content-analyzer', {
        body: {
          data: input.data,
          metrics: input.metrics
        }
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          analysisResults: data.analysis,
          recommendations: data.recommendations,
          metrics: data.metrics
        },
        predictions: {
          engagement: 0.85,
          conversion: 0.65,
          roi: 2.8
        }
      };
    } catch (error) {
      console.error('Error in AnalysisModule:', error);
      return {
        success: false,
        data: null,
        predictions: {
          engagement: 0,
          conversion: 0,
          roi: 0
        }
      };
    }
  }
}