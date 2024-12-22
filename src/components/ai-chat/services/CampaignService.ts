import { supabase } from '@/lib/supabaseClient';
import { WorkflowConfig } from '../types/workflow';

export class CampaignService {
  static async createCampaign(content: string, config: WorkflowConfig) {
    try {
      console.log('Creating campaign with config:', config);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error('Erreur d\'authentification');
      }

      if (!user?.email) {
        console.error('User email is required');
        throw new Error('Email utilisateur requis');
      }

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
          user_id: user.id
        })
        .select()
        .single();

      if (campaignError) {
        console.error('Error creating campaign:', campaignError);
        throw new Error('Impossible de créer la campagne');
      }

      return campaignData;
    } catch (error) {
      console.error('Error in createCampaign:', error);
      throw error;
    }
  }
}