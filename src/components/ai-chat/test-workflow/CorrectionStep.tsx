import { Card } from "@/components/ui/card";
import { TestResults } from "./types/test-results";
import { TestRecommendations } from "../TestRecommendations";

interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: () => void;
  testResults: TestResults;
  previousResults?: TestResults;
  onRecommendationClick: (recommendation: string) => void;
}

export const CorrectionStep = ({
  validationErrors,
  onApplyCorrections,
  testResults,
  previousResults,
  onRecommendationClick
}: CorrectionStepProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Corrections suggérées</h3>
      <TestRecommendations
        recommendations={validationErrors}
        risks={testResults.risks || []}
        opportunities={testResults.opportunities || []}
        onRecommendationClick={onRecommendationClick}
      />
    </Card>
  );
};