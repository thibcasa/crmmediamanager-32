import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class CreativeModule implements AIModule {
  async execute(input: { content: string; style: string }): Promise<ModuleResult> {
    try {
      const { data, error } = await supabase.functions.invoke('huggingface-integration', {
        body: {
          action: 'generate-image',
          content: input.content,
          style: input.style
        }
      });

      if (error) throw error;

      return {
        success: true,
        data: data.imageUrl,
        predictions: await this.predict(data.imageUrl)
      };
    } catch (error) {
      console.error('Error in CreativeModule:', error);
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

  async predict(imageUrl: string): Promise<{ engagement: number; conversion: number; roi: number }> {
    return {
      engagement: 0.90,
      conversion: 0.70,
      roi: 3.0
    };
  }

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: ['Améliorer le contraste', 'Ajouter du texte overlay'],
        priority: 'high'
      }
    };
  }
}