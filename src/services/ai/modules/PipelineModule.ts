import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class PipelineModule implements AIModule {
  async execute(input: { leads: any[]; stages: string[] }): Promise<ModuleResult> {
    try {
      const { data, error } = await supabase.functions.invoke('pipeline-analyzer', {
        body: {
          leads: input.leads,
          stages: input.stages
        }
      });

      if (error) throw error;

      return {
        success: true,
        data: data.pipeline,
        predictions: await this.predict(data.pipeline)
      };
    } catch (error) {
      console.error('Error in PipelineModule:', error);
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

  async predict(pipeline: any): Promise<{ engagement: number; conversion: number; roi: number }> {
    return {
      engagement: 0.70,
      conversion: 0.50,
      roi: 2.2
    };
  }

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: ['Réduire le temps entre les étapes', 'Automatiser les relances'],
        priority: 'high'
      }
    };
  }
}