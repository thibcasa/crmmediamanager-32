import { AIModule, ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export abstract class BaseModule implements AIModule {
  abstract moduleName: string;

  async execute(input: any): Promise<ModuleResult> {
    try {
      console.log(`Executing ${this.moduleName} module with input:`, input);
      
      const { data, error } = await supabase.functions.invoke(`ai-${this.moduleName}`, {
        body: { input }
      });

      if (error) throw error;

      const predictions = await this.predict(data);

      return {
        success: true,
        data: data,
        predictions
      };
    } catch (error) {
      console.error(`Error in ${this.moduleName} module:`, error);
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

  abstract predict(data: any): Promise<{
    engagement: number;
    conversion: number;
    roi: number;
  }>;

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: ['Optimisation automatique suggérée'],
        priority: 'medium'
      }
    };
  }
}