import { ModuleType, ModuleResult, CampaignObjective } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

export class ModuleOrchestrator {
  static async executeModuleChain(objective: CampaignObjective) {
    console.log('Starting module chain execution with objective:', objective);
    
    try {
      // Log orchestration start
      await this.logOrchestrationStart(objective);

      // Call the workflow generator function
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: { 
          action: 'generate_workflow',
          objective: objective.objective
        }
      });

      if (error) throw error;

      // Map the results to our module structure
      const results: Record<ModuleType, ModuleResult> = {
        subject: {
          success: true,
          data: data.subjects,
          predictions: {
            engagement: 0.8,
            conversion: 0.2,
            roi: 3.5
          },
          validationScore: 0.9
        },
        title: {
          success: true,
          data: data.titles,
          predictions: {
            engagement: 0.75,
            conversion: 0.15,
            roi: 2.8
          },
          validationScore: 0.85
        },
        content: {
          success: true,
          data: data.contents,
          predictions: {
            engagement: 0.7,
            conversion: 0.12,
            roi: 2.5
          },
          validationScore: 0.88
        },
        creative: {
          success: true,
          data: data.visuals,
          predictions: {
            engagement: 0.85,
            conversion: 0.18,
            roi: 3.2
          },
          validationScore: 0.92
        },
        workflow: {
          success: true,
          data: data.workflow,
          predictions: {
            engagement: 0.82,
            conversion: 0.16,
            roi: 3.0
          },
          validationScore: 0.95
        },
        pipeline: {
          success: true,
          data: data.pipeline,
          predictions: {
            engagement: 0.8,
            conversion: 0.15,
            roi: 2.9
          },
          validationScore: 0.9
        },
        predictive: {
          success: true,
          data: data.predictions,
          predictions: data.predictions,
          validationScore: 0.88
        },
        analysis: {
          success: true,
          data: {
            insights: data.predictions,
            recommendations: data.corrections.suggestions
          },
          predictions: data.predictions,
          validationScore: 0.85
        },
        correction: {
          success: true,
          data: data.corrections,
          predictions: {
            engagement: data.predictions.engagement * 1.15,
            conversion: data.predictions.conversion * 1.08,
            roi: data.predictions.roi * 1.25
          },
          validationScore: 0.9
        }
      };

      // Log results to automation_logs
      await this.logModuleResults(objective, results);

      return results;
    } catch (error) {
      console.error('Error in module chain execution:', error);
      throw error;
    }
  }

  private static async logOrchestrationStart(objective: CampaignObjective) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No user found for logging orchestration start');
      return;
    }

    await supabase.from('automation_logs').insert({
      user_id: user.id,
      action_type: 'orchestration_start',
      description: `Started orchestration for objective: ${objective.objective}`,
      metadata: {
        objective,
        timestamp: new Date().toISOString()
      }
    });
  }

  private static async logModuleResults(objective: CampaignObjective, results: Record<ModuleType, ModuleResult>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No user found for logging module results');
      return;
    }

    await supabase.from('automation_logs').insert({
      user_id: user.id,
      action_type: 'orchestration_complete',
      description: `Completed orchestration for objective: ${objective.objective}`,
      metadata: {
        objective,
        results,
        timestamp: new Date().toISOString()
      }
    });
  }
}