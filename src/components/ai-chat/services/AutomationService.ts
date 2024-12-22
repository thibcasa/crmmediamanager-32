import { supabase } from '@/lib/supabaseClient';
import { WorkflowConfig } from '../types/workflow';

export class AutomationService {
  static async createAutomation(config: WorkflowConfig) {
    try {
      console.log('Creating automation for config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: automationData, error: automationError } = await supabase
        .from('automations')
        .insert({
          name: `Suivi ${config.platform} Nice`,
          user_id: userData.user.id,
          trigger_type: "lead_created",
          trigger_config: { source: config.platform.toLowerCase() },
          actions: [
            {
              type: "send_message",
              template: `follow_up_${config.platform.toLowerCase()}`,
              delay: "2d"
            },
            {
              type: "create_task",
              template: "qualification_call",
              delay: "4d"
            },
            {
              type: "schedule_meeting",
              template: "discovery_call",
              delay: "7d",
              conditions: { engagement_score: ">70" }
            }
          ],
          is_active: true,
          ai_enabled: true
        })
        .select()
        .single();

      if (automationError) throw automationError;
      return automationData;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  }
}