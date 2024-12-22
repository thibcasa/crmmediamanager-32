import { supabase } from '@/lib/supabaseClient';
import { WorkflowConfig } from '../types/workflow';

export class CampaignService {
  static async createCampaign(content: string, config: WorkflowConfig) {
    try {
      console.log('Creating campaign with config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${config.platform} Nice - Propriétaires`,
          platform: config.platform.toLowerCase(),
          status: 'active',
          targeting_criteria: {
            location: config.location,
            age_range: "35-65",
            job_titles: ["Cadre", "Manager", "Directeur"],
            interests: ["Immobilier", "Investissement"]
          },
          message_template: content,
          schedule: {
            frequency: config.frequency,
            times: ["09:00", "12:00", "17:00"],
            days: ["monday", "wednesday", "friday"]
          },
          user_id: userData.user.id
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      return campaignData;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
}