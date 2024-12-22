import { supabase } from '@/lib/supabaseClient';
import { WorkflowConfig } from '../types/workflow';

export class PipelineService {
  static async createPipeline(config: WorkflowConfig) {
    try {
      console.log('Creating pipeline for config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipelines')
        .insert({
          name: `Pipeline ${config.platform} Nice`,
          description: `Suivi des prospects ${config.platform} - Propriétaires Nice`,
          user_id: userData.user.id,
          stages: [
            {
              name: "Premier contact",
              criteria: { source: config.platform.toLowerCase(), status: "new" }
            },
            {
              name: "Intéressé",
              criteria: { engagement_score: ">50" }
            },
            {
              name: "Rendez-vous",
              criteria: { meeting_scheduled: true }
            },
            {
              name: "Estimation",
              criteria: { property_evaluated: true }
            }
          ]
        })
        .select()
        .single();

      if (pipelineError) throw pipelineError;
      return pipelineData;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  }
}