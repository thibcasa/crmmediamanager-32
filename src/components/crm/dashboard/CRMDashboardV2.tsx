import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Brain, ListFilter, Settings, Activity } from 'lucide-react';
import { ModulesList } from './modules/ModulesList';
import { CampaignOverview } from './overview/CampaignOverview';
import { ModuleMetrics } from './metrics/ModuleMetrics';

export const CRMDashboardV2 = () => {
  const { toast } = useToast();

  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns-overview'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tableau de Bord CRM</h2>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">IA Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Campagnes Actives</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {campaignsData?.filter(c => c.status === 'active').length || 0}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Modules Validés</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {campaignsData?.filter(c => c.ai_feedback?.performance_score > 0.8).length || 0}
          </p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Optimisations</h3>
          </div>
          <p className="text-2xl font-bold mt-2">
            {campaignsData?.reduce((acc, curr) => acc + (curr.optimization_cycles?.length || 0), 0) || 0}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <CampaignOverview campaigns={campaignsData || []} />
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <ModulesList campaigns={campaignsData || []} />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <ModuleMetrics campaigns={campaignsData || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};