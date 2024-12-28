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
}

export const TestStep = ({ isAnalyzing, onTest, testResults }: TestStepProps) => {
  const afterCorrection: TestResults = {
    ...testResults,
    engagement: testResults.engagement * 1.2,
    clickRate: testResults.clickRate * 1.15,
    conversionRate: testResults.conversionRate * 1.25,
    cpa: testResults.cpa * 0.8,
    roi: testResults.roi * 1.3,
    recommendations: [
      "Ciblage optimisé pour la zone des Alpes-Maritimes",
      "Message plus percutant avec call-to-action clair",
      "Visuels améliorés pour plus d'impact"
    ],
    risks: [
      "Maintenir la qualité des leads pendant la montée en charge",
      "Surveiller le CPA pendant l'optimisation"
    ],
    opportunities: [
      "Fort potentiel d'amélioration du ROI",
      "Possibilité d'étendre la zone de ciblage"
    ]
  };

  return (
    <div className="space-y-6">
      <MetricsVisualization before={testResults} after={afterCorrection} />
      
      <DetailedReport before={testResults} after={afterCorrection} />

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