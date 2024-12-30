import { BaseModule, ModuleResult } from './types';
import { supabase } from '@/lib/supabaseClient';

export class SubjectModule implements BaseModule {
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
      const optimizedSubjects = await this.optimize(aiResponse.subjects, predictions);

      return {
        success: true,
        data: optimizedSubjects,
        predictions: {
          engagement: predictions.averageEngagement,
          performance: predictions.overallScore
        },
        metrics: {
          relevanceScore: predictions.relevanceScore,
          trendScore: predictions.trendScore
        }
      };
    } catch (error) {
      console.error('Error in subject module:', error);
      throw error;
    }
  }

  async predict(subjects: string[]): Promise<any> {
    const { data } = await supabase.functions.invoke('predictive-analysis', {
      body: {
        type: 'subject_analysis',
        subjects
      }
    });
    return data;
  }

  async optimize(subjects: string[], predictions: any): Promise<string[]> {
    return subjects.filter(subject => 
      predictions.subjectScores[subject]?.relevanceScore > 0.7
    );
  }
}