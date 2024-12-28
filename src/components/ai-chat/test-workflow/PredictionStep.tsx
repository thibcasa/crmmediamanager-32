import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp } from "lucide-react";
import { TestResults } from "./types/test-results";
import { usePredictiveAnalysis } from "@/hooks/usePredictiveAnalysis";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionStepProps {
  isAnalyzing: boolean;
  progress: number;
  testResults: TestResults;
  onAnalyze: () => void;
  messageToTest?: string;
  iterationCount: number;
}

export const PredictionStep = ({
  isAnalyzing,
  progress,
  testResults,
  onAnalyze,
  messageToTest,
  iterationCount
}: PredictionStepProps) => {
  const { analyzeCampaign, predictions } = usePredictiveAnalysis();

  const handleAnalysis = async () => {
    if (!messageToTest) return;

    const historicalData = {
      previousCampaigns: [],
      marketMetrics: {
        averageEngagement: 0.35,
        averageConversion: 0.08,
        seasonalTrends: []
      }
    };

    const marketContext = {
      region: "Alpes-Maritimes",
      propertyTypes: ["Appartement", "Villa", "Maison"],
      priceRange: { min: 300000, max: 1500000 },
      marketConditions: "stable"
    };

    await analyzeCampaign(messageToTest, historicalData, marketContext);
    onAnalyze();
  };

  const trendData = predictions?.engagement.trends || [
    { date: '2024-01', value: 65 },
    { date: '2024-02', value: 75 },
    { date: '2024-03', value: 85 },
    { date: '2024-04', value: 90 },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Analyse Prédictive</h3>
          <Button 
            onClick={handleAnalysis} 
            disabled={isAnalyzing || !messageToTest}
            className="flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                Analyse en cours...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Lancer l'analyse
              </>
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <Progress value={progress} className="w-full mb-4" />
        )}

        {predictions && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">Engagement prévu</h4>
                <p className="text-2xl font-bold">
                  {(predictions.engagement.rate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Confiance: {(predictions.engagement.confidence * 100).toFixed(1)}%
                </p>
              </Card>

              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">ROI projeté</h4>
                <p className="text-2xl font-bold">{predictions.roi.predicted.toFixed(1)}x</p>
                <p className="text-sm text-muted-foreground">
                  Min: {predictions.roi.worstCase.toFixed(1)}x | Max: {predictions.roi.bestCase.toFixed(1)}x
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="text-sm font-medium mb-4">Tendances d'engagement</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {predictions.recommendations.length > 0 && (
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">Recommandations</h4>
                <ul className="space-y-2">
                  {predictions.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};