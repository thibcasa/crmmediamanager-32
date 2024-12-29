import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationWorkflow } from "@/components/workflow/AutomationWorkflow";
import { supabase } from "@/lib/supabaseClient";
import { PlayCircle, PauseCircle, Settings } from 'lucide-react';

const Workflow = () => {
  const { data: activeCampaigns } = useQuery({
    queryKey: ['active-campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .select(`
          id,
          name,
          platform,
          status,
          created_at,
          targeting_criteria,
          content_strategy
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Workflow Marketing</h1>
        <p className="text-muted-foreground mt-2">
          Automatisez et optimisez vos campagnes marketing avec l'IA
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Campagnes Actives
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automatisations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-4">
            {!activeCampaigns?.length ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Aucune campagne active pour le moment
                </p>
              </Card>
            ) : (
              activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{campaign.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {campaign.platform}
                        </Badge>
                        <Badge variant="secondary">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      Active
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Ciblage</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.targeting_criteria?.cities?.length || 0} villes ciblées
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stratégie</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.content_strategy?.posting_frequency || 'Non définie'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <AutomationWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workflow;