import { supabase } from '@/lib/supabaseClient';
import { PostMetrics, SocialPost, PostOptimization } from '@/types/social-crm';

export class PostOptimizationService {
  static async analyzePostPerformance(postId: string): Promise<PostMetrics | null> {
    try {
      const { data: post } = await supabase
        .from('post_performances')
        .select('*')
        .eq('post_id', postId)
        .single();

      if (!post) return null;

      return {
        engagement_rate: post.engagement_rate || 0,
        clicks: post.clicks || 0,
        impressions: post.impressions || 0,
        leads_generated: 0, // À implémenter avec le tracking des leads
        sentiment_score: 0, // À implémenter avec l'analyse de sentiment
      };
    } catch (error) {
      console.error('Error analyzing post performance:', error);
      return null;
    }
  }

  static async optimizeUnderperformingPost(
    post: SocialPost,
    currentMetrics: PostMetrics
  ): Promise<PostOptimization | null> {
    try {
      // Générer du contenu optimisé avec l'IA
      const { data: optimizedContent, error } = await supabase.functions.invoke(
        'content-workflow-generator',
        {
          body: {
            action: 'optimize_content',
            content: post.content,
            metrics: currentMetrics,
            platform: post.platform,
          },
        }
      );

      if (error) throw error;

      const optimization: PostOptimization = {
        original_content: post.content,
        optimized_content: optimizedContent.content,
        optimization_type: 'engagement',
        applied_at: new Date().toISOString(),
      };

      // Sauvegarder l'optimisation
      await supabase.from('ab_tests').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        post_id: post.id,
        variant_type: 'content_optimization',
        variant_content: optimizedContent.content,
        status: 'running',
      });

      return optimization;
    } catch (error) {
      console.error('Error optimizing post:', error);
      return null;
    }
  }

  static async monitorPostPerformance(postId: string) {
    const channel = supabase
      .channel('post-performance')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_performances',
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          const metrics = payload.new as PostMetrics;
          
          // Si les métriques sont en dessous des objectifs, optimiser
          if (metrics.engagement_rate < 0.02) {
            const { data: post } = await supabase
              .from('social_campaigns')
              .select('*')
              .eq('id', postId)
              .single();

            if (post) {
              await this.optimizeUnderperformingPost(post, metrics);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}