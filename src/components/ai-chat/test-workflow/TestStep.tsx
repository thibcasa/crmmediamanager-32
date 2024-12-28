import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { TestResults } from "../types/test-results";
import { MetricsVisualization } from "./MetricsVisualization";
import { DetailedReport } from "./DetailedReport";

interface TestStepProps {
  isAnalyzing: boolean;
  onTest: () => void;
  testResults: TestResults;
  previousResults?: TestResults;
  iterationCount: number;
}

export const TestStep = ({ 
  isAnalyzing, 
  onTest, 
  testResults,
  previousResults,
  iterationCount 
}: TestStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium">Résultats du test #{iterationCount}</h4>
      </div>

      <MetricsVisualization before={previousResults || testResults} after={testResults} />
      
      <DetailedReport before={previousResults || testResults} after={testResults} />

      <Button
        variant="outline"
        onClick={onTest}
        disabled={isAnalyzing}
        className="w-full flex items-center gap-2 justify-center"
      >
        <TestTube className="h-4 w-4" />
        {isAnalyzing ? 'Test en cours...' : 'Tester les corrections'}
      </Button>
    </div>
  );
};