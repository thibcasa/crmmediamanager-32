import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Users, Target } from "lucide-react";
import { TestMetrics } from "../TestMetrics";
import { TestRecommendations } from "../TestRecommendations";
import { PredictionStepProps } from "./types/prediction-step";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const PredictionStep = ({ 
  isAnalyzing, 
  progress, 
  testResults, 
  onAnalyze,
  messageToTest,
  iterationCount
}: PredictionStepProps) => {
  const performanceData = [
    { name: 'Semaine 1', leads: testResults.predictedMetrics?.leadsPerWeek || 0 },
    { name: 'Semaine 2', leads: (testResults.predictedMetrics?.leadsPerWeek || 0) * 1.2 },
    { name: 'Semaine 3', leads: (testResults.predictedMetrics?.leadsPerWeek || 0) * 1.5 },
    { name: 'Semaine 4', leads: (testResults.predictedMetrics?.leadsPerWeek || 0) * 1.8 },
  ];

  return (
    <div className="space-y-6">
      {isAnalyzing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Analyse prédictive en cours... {progress}%
          </p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={onAnalyze}
        disabled={isAnalyzing || !messageToTest}
        className="w-full flex items-center gap-2 justify-center"
      >
        <Brain className="h-4 w-4" />
        {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse prédictive'}
      </Button>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="campaign" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Campagne
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card className="p-4">
            <TestMetrics results={testResults} />
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-4">Projection des leads</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audience">
          <Card className="p-4 space-y-4">
            {testResults.audienceInsights?.segments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{segment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {(segment.score * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Potentiel</p>
                  <p className="font-medium text-green-600">
                    {(segment.potential * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="campaign">
          <Card className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Créatives</h4>
              <div className="grid grid-cols-2 gap-4">
                {testResults.campaignDetails?.creatives.map((creative, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium capitalize">{creative.type}</p>
                    <p className="text-sm text-muted-foreground">
                      Performance: {(creative.performance * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Messages clés</h4>
              <ul className="space-y-2">
                {testResults.campaignDetails?.content.messages.map((message, index) => (
                  <li key={index} className="text-sm">{message}</li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <TestRecommendations 
        recommendations={testResults.recommendations}
        risks={testResults.risks}
        opportunities={testResults.opportunities}
      />
    </div>
  );
};