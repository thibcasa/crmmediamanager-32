import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

export interface ContentAnalysis {
  sentiment: number;
  predictedEngagement: number;
  audienceMatch: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  type: 'tone' | 'engagement' | 'timing';
  message: string;
  suggestion: string;
}

export class ContentAnalyzer {
  async analyzeContent(content: string): Promise<ContentAnalysis> {
    try {
      console.log('Starting content analysis for:', content);

      const { data: analysis, error } = await supabase.functions.invoke('content-analyzer', {
        body: { content }
      });

      if (error) throw error;

      // Store analysis results
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('content_analysis')
        .insert({
          sentiment_score: analysis.sentiment,
          engagement_prediction: analysis.predictedEngagement,
          audience_match_score: analysis.audienceMatch,
          recommendations: analysis.recommendations
        })
        .select()
        .single();

      if (saveError) throw saveError;

      return {
        sentiment: analysis.sentiment,
        predictedEngagement: analysis.predictedEngagement,
        audienceMatch: analysis.audienceMatch,
        recommendations: analysis.recommendations
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse du contenu.",
        variant: "destructive"
      });
      throw error;
    }
  }

  async getAnalysisHistory(): Promise<ContentAnalysis[]> {
    const { data, error } = await supabase
      .from('content_analysis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}