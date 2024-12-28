import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain } from "lucide-react";
import { TestMetrics } from "../TestMetrics";
import { TestRecommendations } from "../TestRecommendations";
import { PredictionStepProps } from "./types/prediction-step";

export const PredictionStep = ({ 
  isAnalyzing, 
  progress, 
  testResults, 
  onAnalyze,
  messageToTest,
  iterationCount
}: PredictionStepProps) => {
  return (
    <div className="space-y-4">
      {isAnalyzing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Analyse en cours... {progress}%
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
        {isAnalyzing ? 'Analyse en cours...' : 'Lancer la prédiction'}
      </Button>

      <TestMetrics results={testResults} />
      <TestRecommendations 
        recommendations={testResults.recommendations}
        risks={testResults.risks}
        opportunities={testResults.opportunities}
      />
    </div>
  );
};