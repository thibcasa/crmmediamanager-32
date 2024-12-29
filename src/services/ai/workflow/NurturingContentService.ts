import { supabase } from '@/lib/supabaseClient';

export class NurturingContentService {
  static async generateSequence(params: {
    objective: string;
    audience: any;
    touchpoints: number;
  }) {
    try {
      console.log('Generating nurturing sequence for:', params);

      const { data: sequence } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          type: 'nurturing_sequence',
          params
        }
      });

      return sequence;
    } catch (error) {
      console.error('Error generating sequence:', error);
      throw error;
    }
  }

  static async optimizeContent(contentData: any, performanceMetrics: any) {
    try {
      const { data: optimizedContent } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          type: 'content_optimization',
          contentData,
          performanceMetrics
        }
      });

      return optimizedContent;
    } catch (error) {
      console.error('Error optimizing content:', error);
      throw error;
    }
  }
}