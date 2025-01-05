import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

export class TitleOptimizationService {
  async optimizeTitle(subject: string, tone: string, targetAudience: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'optimize_title',
          subject,
          tone,
          targetAudience,
          context: {
            industry: 'real_estate',
            location: 'Alpes-Maritimes',
            platform: 'linkedin'
          }
        }
      });

      if (error) throw error;

      return data.titles || [];
    } catch (error) {
      console.error('Error optimizing title:', error);
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser le titre",
        variant: "destructive"
      });
      return [];
    }
  }

  async analyzeTitlePerformance(title: string): Promise<{
    seoScore: number;
    engagementPrediction: number;
    suggestions: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'analyze_title',
          title,
          context: {
            industry: 'real_estate',
            targetMarket: 'luxury_properties'
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error analyzing title:', error);
      return {
        seoScore: 0,
        engagementPrediction: 0,
        suggestions: []
      };
    }
  }
}