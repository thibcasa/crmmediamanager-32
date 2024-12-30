import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

export class ModuleValidationService {
  static async validateModule(type: ModuleType, result: ModuleResult): Promise<{
    isValid: boolean;
    score: number;
    feedback: string[];
  }> {
    const thresholds = {
      subject: 0.7,
      title: 0.75,
      content: 0.8,
      creative: 0.75,
      workflow: 0.8,
      pipeline: 0.85,
      analysis: 0.8,
      correction: 0.9
    };

    console.log(`Validating ${type} module with result:`, result);

    const score = this.calculateScore(result);
    const isValid = score >= thresholds[type];
    const feedback = this.generateFeedback(type, result, score);

    // Log validation result
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
    // Weighted average of predictions
    return (engagement * 0.4 + conversion * 0.3 + roi * 0.3);
  }

  private static generateFeedback(type: ModuleType, result: ModuleResult, score: number): string[] {
    const feedback: string[] = [];

    if (score < 0.5) {
      feedback.push(`${type} performance is critically low`);
    } else if (score < 0.7) {
      feedback.push(`${type} needs significant improvements`);
    }

    if (result.predictions.engagement < 0.6) {
      feedback.push('Engagement predictions are below target');
    }
    if (result.predictions.conversion < 0.5) {
      feedback.push('Conversion rate needs improvement');
    }
    if (result.predictions.roi < 2.0) {
      feedback.push('ROI is below expected threshold');
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
        description: `Validation of ${type} module`,
        status: isValid ? 'success' : 'failed',
        metadata: {
          score,
          feedback,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging validation:', error);
    }
  }
}