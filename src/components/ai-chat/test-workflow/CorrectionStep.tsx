import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { CorrectionStepProps } from "./types/correction-step";
import { DetailedReport } from "./DetailedReport";

export const CorrectionStep = ({ 
  validationErrors, 
  onApplyCorrections,
  testResults,
  previousResults
}: CorrectionStepProps) => {
  return (
    <div className="space-y-4">
      {validationErrors.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">Suggestions d'amélioration :</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-yellow-700">{error}</li>
            ))}
          </ul>
        </Card>
      )}

      <DetailedReport before={previousResults || testResults} after={testResults} />

      <Button
        variant="outline"
        onClick={onApplyCorrections}
        className="w-full flex items-center gap-2 justify-center"
      >
        <Wrench className="h-4 w-4" />
        Appliquer les corrections
      </Button>
    </div>
  );
};