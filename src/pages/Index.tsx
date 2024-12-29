import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, BarChart3, Loader2 } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ActiveCampaigns } from "@/components/campaigns/ActiveCampaigns";

const Index = () => {
  const [activeTab, setActiveTab] = useState("workflow");

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Erreur d'authentification</h1>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos campagnes et suivez vos performances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("campaigns")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Campagnes en cours</h3>
              <p className="text-sm text-muted-foreground">Gérer vos campagnes actives</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("workflow")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Workflows</h3>
              <p className="text-sm text-muted-foreground">Optimisation IA</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("pipeline")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Pipeline</h3>
              <p className="text-sm text-muted-foreground">Suivi des leads</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Campagnes en cours
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pipeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <ActiveCampaigns />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Workflows</h2>
            <p className="text-muted-foreground">
              Visualisez et optimisez vos workflows de campagne avec l'aide de l'IA.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pipeline</h2>
            <p className="text-muted-foreground">
              Suivez l'évolution de vos leads et les actions automatiques.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;