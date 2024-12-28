import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Building2,
  BarChart3,
} from 'lucide-react';
import { AIGuidedCampaignWorkflow } from "@/components/social/AIGuidedCampaignWorkflow";
import { TrendAnalyzer } from "@/components/analytics/TrendAnalyzer";
import { PredictiveAnalysis } from "@/components/analytics/PredictiveAnalysis";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("ai-prediction");

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Tableau de bord CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos stratégies de prospection et optimisez vos conversions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab("ai-prediction")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">IA & Prédiction</h3>
              <p className="text-sm text-muted-foreground">Optimisation intelligente</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab("properties")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Propriétés</h3>
              <p className="text-sm text-muted-foreground">Biens immobiliers</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab("analytics")}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
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
          <TabsTrigger value="ai-prediction" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            IA & Prédiction
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Propriétés
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-prediction">
          <Card className="p-6">
            <AIGuidedCampaignWorkflow />
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Gestion des Propriétés</h2>
            <p className="text-muted-foreground">
              Liste et détails des biens immobiliers dans votre portefeuille
            </p>
            {/* Nous pouvons ajouter ici la liste des propriétés une fois que le composant sera créé */}
          </Card>
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
