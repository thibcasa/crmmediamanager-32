import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";
import { TestResults } from "./types/test-results";
import { MetricsGrid } from "./components/metrics/MetricsGrid";
import { TestRecommendations } from "./components/TestRecommendations";

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
        <Button
          variant="outline"
          onClick={onTest}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          {isAnalyzing ? 'Test en cours...' : 'Lancer le test'}
        </Button>
      </div>

      <MetricsGrid results={testResults} previousResults={previousResults} />
      
      <TestRecommendations results={testResults} previousResults={previousResults} />
    </div>
  );
};