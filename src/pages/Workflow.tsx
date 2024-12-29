import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationWorkflow } from "@/components/workflow/AutomationWorkflow";
import { supabase } from "@/lib/supabaseClient";
import { PlayCircle, PauseCircle, Settings, Brain, TrendingUp, Target } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Workflow = () => {
  const { toast } = useToast();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Récupérer les campagnes actives et leurs workflows associés
  const { data: campaignWorkflows } = useQuery({
    queryKey: ['campaign-workflows'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: campaigns, error: campaignError } = await supabase
        .from('social_campaigns')
        .select(`
          id,
          name,
          platform,
          status,
          created_at,
          current_prediction,
          optimization_cycles,
          workflow_templates (
            id,
            name,
            triggers,
            actions,
            prediction_metrics
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (campaignError) throw campaignError;
      return campaigns;
    }
  });

  // Fonction pour analyser et optimiser un workflow
  const handleOptimizeWorkflow = async (campaignId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('workflow-analyzer', {
        body: { campaignId }
      });

      if (error) throw error;

      toast({
        title: "Analyse terminée",
        description: "Le workflow a été optimisé en fonction des derniers résultats",
      });

      // Rafraîchir les données
      await supabase.from('social_campaigns')
        .update({
          current_prediction: data.predictions,
          optimization_cycles: data.optimizationHistory
        })
        .eq('id', campaignId);

    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'optimiser le workflow pour le moment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Workflows Marketing</h1>
        <p className="text-muted-foreground mt-2">
          Suivez et optimisez vos workflows de campagne avec l'IA
        </p>
      </div>

      <div className="grid gap-6">
        {campaignWorkflows?.map((campaign) => (
          <Card key={campaign.id} className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">{campaign.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{campaign.platform}</Badge>
                    <Badge 
                      className={
                        campaign.status === 'active' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleOptimizeWorkflow(campaign.id)}
                >
                  <Brain className="h-4 w-4" />
                  Optimiser avec l'IA
                </Button>
              </div>

              <Tabs defaultValue="predictions" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="predictions" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Prédictions
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance
                  </TabsTrigger>
                  <TabsTrigger value="automation" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Automatisations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="predictions" className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-4">Prédictions actuelles</h3>
                    {campaign.current_prediction && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Engagement prévu</p>
                          <p className="text-2xl font-semibold">
                            {(campaign.current_prediction.engagement * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Leads estimés</p>
                          <p className="text-2xl font-semibold">
                            {campaign.current_prediction.estimated_leads || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ROI prévu</p>
                          <p className="text-2xl font-semibold">
                            {campaign.current_prediction.roi?.toFixed(1) || '0'}x
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-4">Cycles d'optimisation</h3>
                    <div className="space-y-4">
                      {campaign.optimization_cycles?.map((cycle: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">Cycle #{index + 1}</p>
                            <Badge variant="outline">
                              {new Date(cycle.timestamp).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {cycle.changes_applied}
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Impact engagement</p>
                              <p className={`text-sm ${cycle.metrics.engagement_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {cycle.metrics.engagement_change >= 0 ? '+' : ''}
                                {(cycle.metrics.engagement_change * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Impact leads</p>
                              <p className={`text-sm ${cycle.metrics.leads_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {cycle.metrics.leads_change >= 0 ? '+' : ''}
                                {cycle.metrics.leads_change}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Impact ROI</p>
                              <p className={`text-sm ${cycle.metrics.roi_change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {cycle.metrics.roi_change >= 0 ? '+' : ''}
                                {cycle.metrics.roi_change.toFixed(2)}x
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="automation" className="space-y-4">
                  <AutomationWorkflow />
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workflow;