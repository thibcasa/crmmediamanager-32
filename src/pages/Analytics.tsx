import { Card } from "@/components/ui/card";
import { PredictiveAnalysis } from "@/components/analytics/PredictiveAnalysis";
import { TrendAnalyzer } from "@/components/analytics/TrendAnalyzer";

export default function Analytics() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold mb-6">Analyse du Marché Immobilier</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analyse Prédictive</h2>
          <PredictiveAnalysis campaignId="default" />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analyse des Tendances</h2>
          <TrendAnalyzer />
        </Card>
      </div>
    </div>
  );
}