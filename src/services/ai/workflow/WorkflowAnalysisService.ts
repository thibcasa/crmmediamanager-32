import { supabase } from '@/lib/supabaseClient';

export class WorkflowAnalysisService {
  static async analyzeWorkflowRequirements(objective: {
    goal: string;
    targetAudience: string;
    expectedResults: Record<string, number>;
  }) {
    try {
      console.log('Analyzing workflow requirements for:', objective);
      
      // Analyser l'objectif pour définir la stratégie de nurturing
      const { data: strategy } = await supabase.functions.invoke('workflow-analyzer', {
        body: {
          objective,
          type: 'nurturing_strategy'
        }
      });

      return strategy;
    } catch (error) {
      console.error('Error analyzing workflow:', error);
      throw error;
    }
  }

  static async optimizeWorkflowTiming(leadData: any) {
    try {
      // Analyser le comportement des leads pour optimiser le timing
      const { data: timing } = await supabase.functions.invoke('workflow-analyzer', {
        body: {
          leadData,
          type: 'timing_optimization'
        }
      });

      return timing;
    } catch (error) {
      console.error('Error optimizing timing:', error);
      throw error;
    }
  }
}