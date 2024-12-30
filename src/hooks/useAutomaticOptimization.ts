import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useAutomaticOptimization = (campaignId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('post-performance')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_performances',
          filter: `post_id=eq.${campaignId}`
        },
        async (payload) => {
          console.log('Nouvelle performance détectée:', payload);
          
          const performance = payload.new;
          if (performance.engagement_rate < 0.05) { // Seuil de 5%
            await handleLowPerformance(performance);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  const handleLowPerformance = async (performance: any) => {
    try {
      setIsOptimizing(true);

      // 1. Créer une variante A/B
      const { data: abTest, error: abError } = await supabase
        .from('ab_tests')
        .insert({
          post_id: performance.post_id,
          variant_type: 'content_optimization',
          status: 'running',
          metadata: {
            original_performance: performance,
            optimization_reason: 'low_engagement'
          }
        })
        .select()
        .single();

      if (abError) throw abError;

      // 2. Générer une nouvelle version optimisée
      const { data: optimizedContent } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          originalContent: performance.metadata?.content,
          platform: performance.platform,
          optimizationType: 'engagement_boost'
        }
      });

      // 3. Mettre à jour le test A/B avec le nouveau contenu
      await supabase
        .from('ab_tests')
        .update({
          variant_content: optimizedContent.content,
          metadata: {
            ...abTest.metadata,
            optimization_suggestions: optimizedContent.suggestions
          }
        })
        .eq('id', abTest.id);

      // 4. Logger l'action
      await supabase
        .from('automation_logs')
        .insert({
          action_type: 'content_optimization',
          description: 'Optimisation automatique pour faible engagement',
          status: 'pending',
          metadata: {
            post_id: performance.post_id,
            ab_test_id: abTest.id,
            original_metrics: performance,
            suggested_changes: optimizedContent.suggestions
          }
        });

      toast({
        title: "Optimisation proposée",
        description: "Une nouvelle version du contenu a été générée et attend validation",
      });

      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['ab-tests'] });

    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser le contenu automatiquement",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return { isOptimizing };
};