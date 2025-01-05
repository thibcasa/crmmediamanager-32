import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PostOptimizationService } from '@/services/social/PostOptimizationService';
import { SocialPost, PostMetrics } from '@/types/social-crm';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useSocialCRM = (postId?: string) => {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ['social-post', postId],
    queryFn: async () => {
      if (!postId) return null;
      const { data } = await supabase
        .from('social_campaigns')
        .select('*')
        .eq('id', postId)
        .single();
      return data as SocialPost | null;
    },
    enabled: !!postId,
  });

  const { data: metrics } = useQuery({
    queryKey: ['post-metrics', postId],
    queryFn: async () => {
      if (!postId) return null;
      return PostOptimizationService.analyzePostPerformance(postId);
    },
    enabled: !!postId,
  });

  useEffect(() => {
    if (!postId) return;
    
    // Mettre en place le monitoring en temps réel
    const cleanup = PostOptimizationService.monitorPostPerformance(postId);
    
    return () => {
      cleanup();
    };
  }, [postId]);

  const optimizePost = async () => {
    if (!post || !metrics) return;

    setIsOptimizing(true);
    try {
      const optimization = await PostOptimizationService.optimizeUnderperformingPost(
        post,
        metrics
      );

      if (optimization) {
        toast({
          title: "Optimisation réussie",
          description: "Le contenu a été optimisé et sera testé",
        });
      }
    } catch (error) {
      console.error('Error optimizing post:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'optimiser le contenu",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    post,
    metrics,
    isLoading,
    isOptimizing,
    optimizePost,
  };
};