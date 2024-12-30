import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class TitleModule implements AIModule {
  async execute(input: { subject: string; keywords: string[] }): Promise<ModuleResult> {
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          type: 'title',
          subject: input.subject,
          keywords: input.keywords
        }
      });

      if (error) throw error;

      return {
        success: true,
        data: data.titles,
        predictions: await this.predict(data.titles)
      };
    } catch (error) {
      console.error('Error in TitleModule:', error);
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

  async predict(titles: string[]): Promise<{ engagement: number; conversion: number; roi: number }> {
    return {
      engagement: 0.85,
      conversion: 0.65,
      roi: 2.5
    };
  }

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: ['Ajouter des chiffres', 'Utiliser des mots émotionnels'],
        priority: 'high'
      }
    };
  }
}