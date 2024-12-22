import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/integrations/supabase/types';

export type SocialCampaign = Database['public']['Tables']['social_campaigns']['Row'];
export type Platform = Database['public']['Enums']['social_platform'];

export class SocialCampaignService {
  static async createCampaign(campaign: Omit<SocialCampaign, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Creating campaign for user:', user.id);

    const { data: campaignData, error: dbError } = await supabase
      .from('social_campaigns')
      .insert([{ 
        ...campaign, 
        user_id: user.id,
        status: campaign.status || 'draft'
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return campaignData;
  }

  static async getCampaigns() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching campaigns for user:', user.id);
    
    const { data, error } = await supabase
      .from('social_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }

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