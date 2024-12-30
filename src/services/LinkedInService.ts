import { supabase } from "@/lib/supabaseClient";

export class LinkedInService {
  static async createPost(content: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Non authentifié');
      }

      const result = await supabase.functions.invoke('linkedin-integration', {
        body: {
          action: 'post',
          data: {
            userId: session.user.id,
            content
          }
        }
      });

      return result.data;
    } catch (error) {
      console.error('Erreur création post LinkedIn:', error);
      throw error;
    }
  }

  static async getPostAnalytics(postId: string) {
    try {
      const result = await supabase.functions.invoke('linkedin-integration', {
        body: {
          action: 'analyze',
          data: { postId }
        }
      });

      return result.data;
    } catch (error) {
      console.error('Erreur récupération analytics LinkedIn:', error);
      throw error;
    }
  }
}