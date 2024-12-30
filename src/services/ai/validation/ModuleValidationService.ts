import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from "@/lib/supabaseClient";

export class ModuleValidationService {
  static async validateModule(type: ModuleType, result: ModuleResult): Promise<{
    isValid: boolean;
    score: number;
    feedback: string[];
  }> {
    console.log(`Validation du module ${type} avec le résultat:`, result);

    const thresholds = {
      subject: 0.7,
      title: 0.75,
      content: 0.8,
      creative: 0.75,
      workflow: 0.8,
      pipeline: 0.85,
      predictive: 0.8,
      analysis: 0.8,
      correction: 0.9
    };

    const score = this.calculateScore(result);
    const isValid = score >= thresholds[type];
    const feedback = this.generateFeedback(type, result, score);

    // Log du résultat de validation
    await this.logValidation(type, isValid, score, feedback);

    return {
      isValid,
      score,
      feedback
    };
  }

  private static calculateScore(result: ModuleResult): number {
    if (!result.predictions) return 0;

    const { engagement, conversion, roi } = result.predictions;
    // Moyenne pondérée des prédictions
    return (engagement * 0.4 + conversion * 0.3 + roi * 0.3);
  }

  private static generateFeedback(type: ModuleType, result: ModuleResult, score: number): string[] {
    const feedback: string[] = [];

    if (score < 0.5) {
      feedback.push(`Les performances du module ${type} sont critiquement basses`);
    } else if (score < 0.7) {
      feedback.push(`Le module ${type} nécessite des améliorations significatives`);
    }

    if (result.predictions.engagement < 0.6) {
      feedback.push('Les prédictions d\'engagement sont en dessous de l\'objectif');
    }
    if (result.predictions.conversion < 0.5) {
      feedback.push('Le taux de conversion doit être amélioré');
    }
    if (result.predictions.roi < 2.0) {
      feedback.push('Le ROI est en dessous du seuil attendu');
    }

    return feedback;
  }

  private static async logValidation(
    type: ModuleType,
    isValid: boolean,
    score: number,
    feedback: string[]
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('automation_logs').insert({
        user_id: user?.id,
        action_type: `module_validation_${type}`,
        description: `Validation du module ${type}`,
        status: isValid ? 'success' : 'failed',
        metadata: {
          score,
          feedback,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la journalisation de la validation:', error);
    }
  }
}