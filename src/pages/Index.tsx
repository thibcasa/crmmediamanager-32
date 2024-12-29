import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Building2,
  BarChart3,
  Loader2
} from 'lucide-react';
import { CampaignCreationWizard } from "@/components/social/campaign-creation/CampaignCreationWizard";
import { TrendAnalyzer } from "@/components/analytics/TrendAnalyzer";
import { PredictiveAnalysis } from "@/components/analytics/PredictiveAnalysis";
import { CRMDashboard } from "@/components/crm/CRMDashboard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Vérifier que l'utilisateur est bien authentifié
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
          CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos contacts et campagnes de prospection immobilière
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("dashboard")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Tableau de Bord</h3>
              <p className="text-sm text-muted-foreground">Vue d'ensemble CRM</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("campaign-creation")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Création de Campagne</h3>
              <p className="text-sm text-muted-foreground">Assistant intelligent</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => setActiveTab("analytics")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Analytics</h3>
              <p className="text-sm text-muted-foreground">Performances & KPIs</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="campaign-creation" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Campagnes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="campaign-creation" className="space-y-4">
          <CampaignCreationWizard />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="space-y-6">
            <TrendAnalyzer />
            <PredictiveAnalysis campaignId="default" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;