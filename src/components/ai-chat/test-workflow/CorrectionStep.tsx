import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { TestResults } from "./types/test-results";
import { useState } from "react";

interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: (appliedCorrections: string[]) => void;
  testResults: TestResults;
  previousResults?: TestResults;
}

export const CorrectionStep = ({
  validationErrors,
  onApplyCorrections,
  testResults,
  previousResults
}: CorrectionStepProps) => {
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([]);
  
  // Get previous recommendations that haven't been applied yet
  const previousRecommendations = previousResults?.recommendations || [];
  const appliedCorrections = testResults.appliedCorrections || [];
  
  const handleCorrectionSelect = (correction: string) => {
    setSelectedCorrections(prev => 
      prev.includes(correction) 
        ? prev.filter(c => c !== correction)
        : [...prev, correction]
    );
  };

  const handleApplyCorrections = () => {
    onApplyCorrections(selectedCorrections);
  };
  
  return (
    <div className="space-y-6">
      {/* Previous Recommendations Section */}
      {previousRecommendations.length > 0 && (
        <Card className="p-4 bg-muted">
          <h4 className="font-medium mb-2">Recommandations précédentes</h4>
          <ul className="space-y-2">
            {previousRecommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {appliedCorrections.includes(rec) ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <span className={appliedCorrections.includes(rec) ? "line-through text-muted-foreground" : ""}>
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* New Corrections Section */}
      <Card className="p-4 border-yellow-200 bg-yellow-50">
        <h4 className="font-medium text-yellow-800 mb-2">Corrections suggérées</h4>
        <ul className="space-y-2">
          {validationErrors.map((error, index) => (
            <li 
              key={index} 
              className="flex items-center gap-2 text-sm text-yellow-700 cursor-pointer hover:bg-yellow-100 p-2 rounded"
              onClick={() => handleCorrectionSelect(error)}
            >
              <input 
                type="checkbox"
                checked={selectedCorrections.includes(error)}
                onChange={() => handleCorrectionSelect(error)}
                className="mr-2"
              />
              <ArrowRight className="h-4 w-4" />
              {error}
            </li>
          ))}
        </ul>
      </Card>

      {/* Metrics Comparison */}
      {previousResults && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Impact des corrections</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Avant corrections</p>
              <ul className="text-sm space-y-1 mt-2">
                <li>ROI: {previousResults.roi.toFixed(2)}</li>
                <li>Engagement: {(previousResults.engagement * 100).toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">Après corrections</p>
              <ul className="text-sm space-y-1 mt-2">
                <li>ROI: {testResults.roi.toFixed(2)}</li>
                <li>Engagement: {(testResults.engagement * 100).toFixed(1)}%</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleApplyCorrections}
          className="flex items-center gap-2"
          disabled={selectedCorrections.length === 0}
        >
          Appliquer les corrections sélectionnées ({selectedCorrections.length})
        </Button>
      </div>
    </div>
  );
};