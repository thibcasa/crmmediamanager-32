import { supabase } from '@/lib/supabaseClient';

export class CampaignAnalysisService {
  static async analyzeObjective(objective: any) {
    try {
      // Analyser l'objectif avec l'IA
      const { data: aiAnalysis } = await supabase.functions.invoke('campaign-analyzer', {
        body: { objective }
      });

      return {
        targeting: {
          demographics: aiAnalysis.targeting.demographics,
          interests: aiAnalysis.targeting.interests,
          behavior: aiAnalysis.targeting.behavior
        },
        content: {
          themes: aiAnalysis.content.themes,
          formats: aiAnalysis.content.formats,
          tone: aiAnalysis.content.tone,
          frequency: aiAnalysis.content.frequency
        },
        timing: {
          bestTimes: aiAnalysis.timing.bestTimes,
          frequency: aiAnalysis.timing.frequency,
          duration: aiAnalysis.timing.duration
        },
        recommendations: aiAnalysis.recommendations
      };
    } catch (error) {
      console.error('Error analyzing campaign objective:', error);
      throw error;
    }
  }
}