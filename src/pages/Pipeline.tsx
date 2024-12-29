import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, ArrowRight, MessageSquare, FileText, Image } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const Pipeline = () => {
  const { toast } = useToast();

  // Fetch active pipelines with their associated campaigns and workflows
  const { data: pipelines, isLoading } = useQuery({
    queryKey: ['active-pipelines'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('pipelines')
        .select(`
          *,
          marketing_campaigns (
            id,
            name,
            status,
            metadata
          ),
          workflow_templates (
            id,
            name,
            triggers,
            actions,
            optimization_history,
            prediction_metrics
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Listen to real-time updates for pipeline changes
  useEffect(() => {
    const channel = supabase
      .channel('pipeline-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pipelines'
        },
        (payload) => {
          console.log('Pipeline update:', payload);
          toast({
            title: "Pipeline mis à jour",
            description: "Le pipeline a été modifié suite à une action du workflow"
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Pipeline de vente</h1>
        <p className="text-muted-foreground mt-2">
          Visualisez l'évolution de vos pipelines de vente gérés par l'IA.
        </p>
      </div>

      {pipelines?.map((pipeline) => (
        <Card key={pipeline.id} className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {pipeline.marketing_campaigns?.[0]?.name || "Pipeline sans campagne"}
              </h2>
              <span className="text-sm text-muted-foreground">
                Créé le {new Date(pipeline.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Pipeline Stage Visualization */}
            <div className="flex items-center gap-4 overflow-x-auto py-4">
              {pipeline.stages.map((stage: any, index: number) => (
                <div key={index} className="flex items-center min-w-[200px]">
                  <div className="flex-1">
                    <Card className="p-4 bg-background border-2 border-primary/10">
                      <h3 className="font-medium mb-2">{stage.name}</h3>
                      <div className="space-y-2">
                        {stage.required_actions?.map((action: string, actionIndex: number) => (
                          <div key={actionIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {action.includes('message') && <MessageSquare className="h-4 w-4" />}
                            {action.includes('content') && <FileText className="h-4 w-4" />}
                            {action.includes('creative') && <Image className="h-4 w-4" />}
                            {action}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                  {index < pipeline.stages.length - 1 && (
                    <ArrowRight className="h-6 w-6 text-muted-foreground mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Workflow Predictions & Metrics */}
            {pipeline.workflow_templates?.[0] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Prédictions IA</h4>
                  <div className="space-y-2">
                    {Object.entries(pipeline.workflow_templates[0].prediction_metrics || {}).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Optimisations</h4>
                  <div className="space-y-2">
                    {(pipeline.workflow_templates[0].optimization_history || []).slice(-3).map((opt: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {opt.action} - {new Date(opt.timestamp).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Actions en cours</h4>
                  <div className="space-y-2">
                    {(pipeline.workflow_templates[0].actions || []).map((action: any, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {action.type} - {action.config?.frequency || 'N/A'}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      ))}

      <PipelineBoard />
    </div>
  );
};

export default Pipeline;