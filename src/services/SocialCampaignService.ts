import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/integrations/supabase/types';

export type SocialCampaign = Database['public']['Tables']['social_campaigns']['Row'];
export type Platform = Database['public']['Enums']['social_platform'];

export class SocialCampaignService {
  static async createCampaign(campaign: Omit<SocialCampaign, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    // First create the campaign in the database
    const { data: campaignData, error: dbError } = await supabase
      .from('social_campaigns')
      .insert([{ ...campaign, user_id: userData.user.id }])
      .select()
      .single();

    if (dbError) throw dbError;

    // Then trigger the social media integration
    const { error: integrationError } = await supabase.functions.invoke('social-media-integration', {
      body: {
        platform: campaign.platform,
        action: 'create_campaign',
        data: {
          ...campaign,
          userId: userData.user.id
        }
      }
    });

    if (integrationError) throw integrationError;
    return campaignData;
  }

  static async getCampaigns() {
    const { data, error } = await supabase
      .from('social_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateCampaign(id: string, updates: Partial<SocialCampaign>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data: campaignData, error: dbError } = await supabase
      .from('social_campaigns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (dbError) throw dbError;

    // Trigger the social media integration update
    if (campaignData) {
      const { error: integrationError } = await supabase.functions.invoke('social-media-integration', {
        body: {
          platform: campaignData.platform,
          action: 'update_campaign',
          data: {
            ...updates,
            id,
            userId: userData.user.id
          }
        }
      });

      if (integrationError) throw integrationError;
    }

    return campaignData;
  }
}