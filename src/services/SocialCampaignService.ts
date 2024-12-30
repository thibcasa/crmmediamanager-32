import { supabase } from '@/lib/supabaseClient';
import { Database } from '@/integrations/supabase/types';

export type SocialCampaign = Database['public']['Tables']['social_campaigns']['Row'];
export type Platform = Database['public']['Enums']['social_platform'];

export class SocialCampaignService {
  static async createCampaign(campaign: Omit<SocialCampaign, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Creating campaign for user:', user.id);

    const { data: campaignData, error: dbError } = await supabase
      .from('social_campaigns')
      .insert([{
        ...campaign,
        user_id: user.id // Explicitly set the user_id
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
    if (!id) {
      throw new Error('Campaign ID is required for update');
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data: campaignData, error: dbError } = await supabase
      .from('social_campaigns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userData.user.id) // Ensure we only update user's own campaigns
      .select()
      .single();

    if (dbError) throw dbError;

    return campaignData;
  }

  static async duplicateCampaign(campaignId: string) {
    if (!campaignId) {
      throw new Error('Campaign ID is required for duplication');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: originalCampaign, error: fetchError } = await supabase
      .from('social_campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', user.id) // Only duplicate user's own campaigns
      .single();

    if (fetchError) throw fetchError;

    const { id, created_at, updated_at, ...campaignData } = originalCampaign;
    
    const { data: newCampaign, error: createError } = await supabase
      .from('social_campaigns')
      .insert([{
        ...campaignData,
        user_id: user.id, // Set user_id for the new campaign
        name: `${campaignData.name} (copie)`,
        status: 'draft'
      }])
      .select()
      .single();

    if (createError) throw createError;
    return newCampaign;
  }

  static async deleteCampaign(id: string) {
    if (!id) {
      throw new Error('Campaign ID is required for deletion');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('social_campaigns')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Only delete user's own campaigns

    if (error) throw error;
  }

  static async optimizeCampaign(id: string) {
    if (!id) {
      throw new Error('Campaign ID is required for optimization');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: campaign, error: fetchError } = await supabase
      .from('social_campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // Only optimize user's own campaigns
      .single();

    if (fetchError) throw fetchError;

    // Appel à l'API d'optimisation
    const response = await supabase.functions.invoke('campaign-analyzer', {
      body: { campaign }
    });

    if (response.error) throw response.error;

    // Mise à jour de la campagne avec les optimisations
    const { error: updateError } = await supabase
      .from('social_campaigns')
      .update({
        ai_feedback: response.data.feedback,
        content_strategy: response.data.optimizedStrategy,
        targeting_criteria: response.data.optimizedTargeting
      })
      .eq('id', id)
      .eq('user_id', user.id); // Ensure we only update user's own campaign

    if (updateError) throw updateError;
  }

  static async getCampaign(id: string): Promise<SocialCampaign> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('social_campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // Only get user's own campaign
      .single();

    if (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }

    return data;
  }
}