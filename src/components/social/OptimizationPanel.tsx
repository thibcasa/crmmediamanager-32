import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Check, X, RefreshCw } from "lucide-react";

export const OptimizationPanel = () => {
  const { toast } = useToast();
  const [pendingOptimizations, setPendingOptimizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPendingOptimizations();

    const channel = supabase
      .channel('optimization-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'automation_logs'
        },
        () => {
          loadPendingOptimizations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPendingOptimizations = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_logs')
        .select(`
          *,
          ab_tests (*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingOptimizations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des optimisations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les optimisations en attente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizationAction = async (logId: string, abTestId: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        // Appliquer l'optimisation
        const { data: abTest } = await supabase
          .from('ab_tests')
          .select('*')
          .eq('id', abTestId)
          .single();

        await supabase.functions.invoke('social-media-integration', {
          body: {
            action: 'update_post',
            data: {
              postId: abTest.post_id,
              content: abTest.variant_content
            }
          }
        });
      }

      // Mettre à jour le statut
      await supabase
        .from('automation_logs')
        .update({
          status: action === 'approve' ? 'applied' : 'rejected',
          applied_at: new Date().toISOString()
        })
        .eq('id', logId);

      toast({
        title: action === 'approve' ? "Optimisation appliquée" : "Optimisation rejetée",
        description: action === 'approve' 
          ? "Les modifications ont été publiées avec succès"
          : "Les modifications ont été rejetées",
      });

      loadPendingOptimizations();
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer l'action",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Optimisations en Attente</h3>
        <span className="text-sm text-muted-foreground">
          {pendingOptimizations.length} en attente
        </span>
      </div>

      <div className="space-y-4">
        {pendingOptimizations.map((optimization) => (
          <Card key={optimization.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{optimization.description}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(optimization.created_at).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">Changements proposés :</p>
                <ul className="list-disc list-inside text-sm">
                  {optimization.metadata.suggested_changes?.map((change: string, index: number) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOptimizationAction(optimization.id, optimization.metadata.ab_test_id, 'reject')}
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOptimizationAction(optimization.id, optimization.metadata.ab_test_id, 'approve')}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Appliquer
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {pendingOptimizations.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Aucune optimisation en attente
          </div>
        )}
      </div>
    </Card>
  );
};