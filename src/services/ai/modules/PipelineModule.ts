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
        data: null
      };
    }
  }

  async predict(pipeline: any): Promise<Record<string, number>> {
    const predictions = {
      engagement: 0.70,
      conversion: 0.50,
      roi: 2.2
    };
    return predictions;
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