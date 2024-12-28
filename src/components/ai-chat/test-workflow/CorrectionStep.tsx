import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { TestResults } from "./types/test-results";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [selectedCorrections, setSelectedCorrections] = useState<string[]>([]);
  
  const handleCorrectionSelect = (correction: string) => {
    setSelectedCorrections(prev => 
      prev.includes(correction) 
        ? prev.filter(c => c !== correction)
        : [...prev, correction]
    );
  };

  const handleApplyCorrections = () => {
    onApplyCorrections(selectedCorrections);
    setSelectedCorrections([]);
  };

  return (
    <div className="space-y-6">
      {previousResults?.recommendations && previousResults.recommendations.length > 0 && (
        <Card className="p-4 bg-muted">
          <h4 className="font-medium mb-2">Corrections précédentes</h4>
          <ul className="space-y-2">
            {previousResults.recommendations.map((rec, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {testResults.appliedCorrections?.includes(rec) ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <span className={testResults.appliedCorrections?.includes(rec) ? "line-through text-muted-foreground" : ""}>
                  {rec}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4 border-yellow-200 bg-yellow-50">
        <h4 className="font-medium text-yellow-800 mb-2">Corrections suggérées</h4>
        <ul className="space-y-2">
          {validationErrors.map((error, index) => (
            <li 
              key={index} 
              className="flex items-center gap-2 text-sm text-yellow-700 p-2 rounded"
            >
              <Checkbox
                id={`correction-${index}`}
                checked={selectedCorrections.includes(error)}
                onCheckedChange={() => handleCorrectionSelect(error)}
              />
              <label
                htmlFor={`correction-${index}`}
                className="flex items-center gap-2 cursor-pointer flex-1"
              >
                <ArrowRight className="h-4 w-4" />
                {error}
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleApplyCorrections}
          disabled={selectedCorrections.length === 0}
          className="flex items-center gap-2"
        >
          Appliquer les corrections ({selectedCorrections.length})
        </Button>
      </div>
    </div>
  );
};