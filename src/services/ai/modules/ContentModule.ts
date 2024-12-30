import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class ContentModule implements AIModule {
  async execute(input: { title: string; keywords: string[] }): Promise<ModuleResult> {
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          type: 'content',
          title: input.title,
          keywords: input.keywords
        }
      });

      if (error) throw error;

      return {
        success: true,
        data: data.content,
        predictions: await this.predict(data.content)
      };
    } catch (error) {
      console.error('Error in ContentModule:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  async predict(content: string): Promise<Record<string, number>> {
    const predictions = {
      engagement: 0.75,
      conversion: 0.55,
      roi: 2.0
    };
    return predictions;
  }

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: ['Ajouter des call-to-action', 'Optimiser pour le SEO'],
        priority: 'medium'
      }
    };
  }
}