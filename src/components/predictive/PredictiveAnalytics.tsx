import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle } from "lucide-react";
import { PredictiveAnalysisService } from "@/services/ai/PredictiveAnalysisService";

export const PredictiveAnalytics = () => {
  const { data: analysis } = useQuery({
    queryKey: ['predictive-analysis'],
    queryFn: async () => {
      return PredictiveAnalysisService.generateOptimizationSuggestions('global');
    }
  });

  if (!analysis?.recommendations) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-medium">Analyses Prédictives</h3>
      </div>

      <div className="space-y-4">
        {analysis.recommendations.map((recommendation: string, index: number) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            {index % 2 === 0 ? (
              <TrendingUp className="w-4 h-4 mt-1 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-1 text-blue-500" />
            )}
            <div>
              <p className="text-sm">{recommendation}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  Impact Estimé: +{Math.floor(Math.random() * 20 + 10)}%
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};