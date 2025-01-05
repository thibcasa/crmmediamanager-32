import { AIModule, ModuleResult } from '@/types/modules';
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
        predictions,
        validationScore: 0.8,
        optimizations: {
          suggestions: ['Optimisation automatique suggérée'],
          priority: 'medium'
        }
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
        },
        validationScore: 0,
        optimizations: {
          suggestions: ['Error occurred'],
          priority: 'high'
        }
      };
    }
  }

  abstract predict(data: any): Promise<{
    engagement: number;
    conversion: number;
    roi: number;
  }>;

  // Add the missing optimize method required by AIModule interface
  async optimize(input: any): Promise<ModuleResult> {
    const result = await this.execute(input);
    if (!result.success) {
      throw new Error(`Optimization failed for ${this.moduleName} module`);
    }
    return result;
  }
}