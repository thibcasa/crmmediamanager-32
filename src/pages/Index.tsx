import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Building2,
  BarChart3,
  Users
} from 'lucide-react';
import { CampaignCreationWizard } from "@/components/social/campaign-creation/CampaignCreationWizard";
import { TrendAnalyzer } from "@/components/analytics/TrendAnalyzer";
import { PredictiveAnalysis } from "@/components/analytics/PredictiveAnalysis";
import { CRMDashboard } from "@/components/crm/CRMDashboard";
import { PersonaBuilder } from "@/components/persona/PersonaBuilder";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos contacts et campagnes de prospection immobilière
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => setActiveTab("dashboard")}>
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

        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => setActiveTab("personas")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Personas</h3>
              <p className="text-sm text-muted-foreground">Gestion des personas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => setActiveTab("campaign-creation")}>
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

        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => setActiveTab("analytics")}>
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
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="personas" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personas
          </TabsTrigger>
          <TabsTrigger value="campaign-creation" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Création de Campagne
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CRMDashboard />
        </TabsContent>

        <TabsContent value="personas">
          <PersonaBuilder />
        </TabsContent>

        <TabsContent value="campaign-creation">
          <CampaignCreationWizard />
        </TabsContent>

        <TabsContent value="analytics">
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