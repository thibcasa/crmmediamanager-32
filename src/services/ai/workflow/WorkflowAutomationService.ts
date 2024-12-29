import { supabase } from '@/lib/supabaseClient';

export class WorkflowAutomationService {
  static async setupNurturingWorkflow(params: {
    strategy: any;
    content: any;
    triggers: any[];
  }) {
    try {
      console.log('Setting up nurturing workflow:', params);

      // Créer les automatisations dans Supabase
      const { data: automation } = await supabase
        .from('automations')
        .insert({
          name: `Nurturing Workflow - ${new Date().toLocaleDateString()}`,
          trigger_type: 'lead_scoring',
          trigger_config: {
            triggers: params.triggers,
            conditions: {
              score_threshold: 50,
              engagement_minimum: 0.3
            }
          },
          actions: [
            {
              type: 'analyze_engagement',
              config: {
                metrics: ['opens', 'clicks', 'responses'],
                frequency: 'realtime'
              }
            },
            {
              type: 'optimize_content',
              config: {
                strategy: params.strategy,
                content: params.content
              }
            },
            {
              type: 'adjust_timing',
              config: {
                based_on: ['engagement_patterns', 'response_times']
              }
            }
          ],
          is_active: true,
          ai_enabled: true
        })
        .select()
        .single();

      return automation;
    } catch (error) {
      console.error('Error setting up workflow:', error);
      throw error;
    }
  }

  static async optimizeWorkflow(workflowId: string, performanceData: any) {
    try {
      const { data: optimization } = await supabase.functions.invoke('workflow-optimizer', {
        body: {
          workflowId,
          performanceData
        }
      });

      return optimization;
    } catch (error) {
      console.error('Error optimizing workflow:', error);
      throw error;
    }
  }
}