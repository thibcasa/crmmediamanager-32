import { supabase } from '@/lib/supabaseClient';

export const SocialSharingService = {
  async shareToLinkedIn(content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('social-media-share', {
      body: {
        platform: 'linkedin',
        content,
        userId: user.id
      }
    });

    if (error) throw error;
    return data;
  }
};