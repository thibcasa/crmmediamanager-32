import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { ArrowRight, Users, Target, TrendingUp, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  score: number;
  notes?: string;
  pipeline_stage: string;
}

export default function PipelineModule() {
  const [selectedView, setSelectedView] = useState<'kanban' | 'funnel'>('kanban');

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['pipeline-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;
      return data as Lead[];
    }
  });

  const { data: pipelineStats, isLoading: statsLoading } = useQuery({
    queryKey: ['pipeline-stats'],
    queryFn: async () => {
      if (!leads) return null;

      return {
        totalLeads: leads.length,
        qualifiedLeads: leads.filter(l => l.score >= 70).length,
        conversionRate: leads.length 
          ? ((leads.filter(l => l.status === 'hot').length / leads.length) * 100).toFixed(1)
          : 0
      };
    },
    enabled: !!leads
  });

  const handleScheduleMeeting = async (leadId: string) => {
    // This would open a meeting scheduler modal
    toast({
      title: "Planification de rendez-vous",
      description: "Fonctionnalité à venir",
    });
  };

  const handleQuickAction = async (leadId: string, action: 'call' | 'email') => {
    toast({
      title: action === 'call' ? "Appel" : "Email",
      description: `Fonctionnalité ${action} à venir`,
    });
  };

  const LeadCard = ({ lead }: { lead: Lead }) => (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{lead.first_name} {lead.last_name}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{lead.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant={lead.status === 'hot' ? 'destructive' : 'secondary'}>
              Score: {lead.score}
            </Badge>
          </div>

          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleQuickAction(lead.id, 'call')}
            >
              <Phone className="w-4 h-4 mr-1" />
              Appeler
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleQuickAction(lead.id, 'email')}
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleScheduleMeeting(lead.id)}
            >
              <Calendar className="w-4 h-4 mr-1" />
              RDV
            </Button>
          </div>

          {lead.notes && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              {lead.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const stages = ['Nouveau', 'Qualification', 'Négociation', 'Closing'];

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
                {stages.map((stage) => (
                  <Card key={stage}>
                    <CardHeader>
                      <CardTitle className="text-sm">{stage}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[600px] overflow-y-auto">
                      {leadsLoading ? (
                        <p className="text-sm text-muted-foreground">Chargement...</p>
                      ) : leads?.filter(lead => lead.pipeline_stage === stage).map(lead => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                      {!leadsLoading && (!leads || leads.filter(lead => lead.pipeline_stage === stage).length === 0) && (
                        <p className="text-sm text-muted-foreground">
                          Aucun lead dans cette étape
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="funnel" className="mt-0">
              <div className="flex flex-col items-center space-y-4">
                {stages.map((stage, index) => {
                  const stageLeads = leads?.filter(lead => lead.pipeline_stage === stage) || [];
                  return (
                    <div 
                      key={stage}
                      className="bg-muted w-full p-4 text-center rounded-lg"
                      style={{
                        width: `${100 - (index * 20)}%`,
                        marginLeft: `${index * 10}%`
                      }}
                    >
                      <p className="font-medium">{stage}</p>
                      <p className="text-sm text-muted-foreground">{stageLeads.length} leads</p>
                    </div>
                  );
                })}
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