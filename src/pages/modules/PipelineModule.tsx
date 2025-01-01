import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Users, Target, TrendingUp } from 'lucide-react';

export default function PipelineModule() {
  const [selectedView, setSelectedView] = useState<'kanban' | 'funnel'>('kanban');

  const { data: pipelineStats, isLoading: statsLoading } = useQuery({
    queryKey: ['pipeline-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status, score')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const stats = {
        totalLeads: leads?.length || 0,
        qualifiedLeads: leads?.filter(l => l.score >= 70).length || 0,
        conversionRate: leads?.length 
          ? ((leads.filter(l => l.status === 'hot').length / leads.length) * 100).toFixed(1)
          : 0
      };

      return stats;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Pipeline</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : pipelineStats?.totalLeads}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Qualifiés</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : pipelineStats?.qualifiedLeads}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : `${pipelineStats?.conversionRate}%`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Views */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vue du Pipeline</CardTitle>
            <Tabs value={selectedView} onValueChange={(v: 'kanban' | 'funnel') => setSelectedView(v)}>
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="funnel">Entonnoir</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView}>
            <TabsContent value="kanban" className="mt-0">
              <div className="grid grid-cols-4 gap-4">
                {['Nouveau', 'Qualification', 'Négociation', 'Closing'].map((stage) => (
                  <Card key={stage}>
                    <CardHeader>
                      <CardTitle className="text-sm">{stage}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px] overflow-y-auto">
                      {/* Placeholder pour les leads - à implémenter */}
                      <p className="text-sm text-muted-foreground">
                        Aucun lead dans cette étape
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="funnel" className="mt-0">
              <div className="flex flex-col items-center space-y-4">
                {['Nouveau', 'Qualification', 'Négociation', 'Closing'].map((stage, index) => (
                  <div 
                    key={stage}
                    className="bg-muted w-full p-4 text-center rounded-lg"
                    style={{
                      width: `${100 - (index * 20)}%`,
                      marginLeft: `${index * 10}%`
                    }}
                  >
                    <p className="font-medium">{stage}</p>
                    <p className="text-sm text-muted-foreground">0 leads</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analytics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analytiques du Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Temps moyen par étape</h4>
                <p className="text-2xl font-bold">3.2 jours</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Valeur du pipeline</h4>
                <p className="text-2xl font-bold">0 €</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}