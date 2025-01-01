import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictiveAnalytics } from "@/components/predictive/PredictiveAnalytics";
import { PredictiveDashboard } from "@/components/predictive/PredictiveDashboard";
import { PredictiveInsights } from "@/components/predictive/PredictiveInsights";

export default function PredictiveModule() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Module Prédictif</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PredictiveDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="insights">
          <PredictiveInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}