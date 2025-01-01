import { BaseModule } from './BaseModule';
import { ModuleResult } from '@/types/social';
import { supabase } from '@/lib/supabaseClient';

export class SubjectModule extends BaseModule {
  moduleName = 'subject';

  async execute(input: { keywords: string[], audience: string }): Promise<ModuleResult> {
    console.log('Executing subject module with input:', input);

    try {
      const { data: aiResponse } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_subjects',
          keywords: input.keywords,
          audience: input.audience,
          count: 3
        }
      });

      const predictions = await this.predict(aiResponse.subjects);

      return {
        success: true,
        data: aiResponse.subjects,
        predictions,
        validationScore: 0.85
      };
    } catch (error) {
      console.error('Error in subject module:', error);
      return {
        success: false,
        data: null,
        predictions: {
          engagement: 0,
          conversion: 0,
          roi: 0
        },
        validationScore: 0
      };
    }
  }

  async predict(subjects: string[]): Promise<{ engagement: number; conversion: number; roi: number }> {
    const { data } = await supabase.functions.invoke('predictive-analysis', {
      body: {
        type: 'subject_analysis',
        subjects
      }
    });
    
    return {
      engagement: data?.engagement || 0.75,
      conversion: data?.conversion || 0.55,
      roi: data?.roi || 2.0
    };
  }

  async optimize(result: ModuleResult): Promise<ModuleResult> {
    return {
      ...result,
      optimizations: {
        suggestions: [
          'Ajouter des mots-clés plus spécifiques',
          'Inclure des chiffres dans les sujets',
          'Utiliser des questions ouvertes'
        ],
        priority: 'high'
      }
    };
  }
}