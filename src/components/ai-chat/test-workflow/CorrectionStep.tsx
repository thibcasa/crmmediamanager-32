import { Card } from "@/components/ui/card";
import { TestRecommendations } from "../TestRecommendations";
import { TestResults } from "./types/test-results";
import { useToast } from "@/hooks/use-toast";

interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: (corrections: string[]) => void;
  testResults: TestResults;
  previousResults?: TestResults;
}

export const CorrectionStep = ({
  validationErrors,
  onApplyCorrections,
  testResults,
  previousResults
}: CorrectionStepProps) => {
  const { toast } = useToast();

  const handleRecommendationClick = (recommendation: string) => {
    onApplyCorrections([recommendation]);
    toast({
      title: "Correction appliquée",
      description: "Une nouvelle analyse va être lancée avec cette recommandation."
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Corrections suggérées</h3>
        <TestRecommendations
          recommendations={validationErrors}
          risks={testResults.risks}
          opportunities={testResults.opportunities}
          onRecommendationClick={handleRecommendationClick}
        />
      </div>
    </Card>
  );
};