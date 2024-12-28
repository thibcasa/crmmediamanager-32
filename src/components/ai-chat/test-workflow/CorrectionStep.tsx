import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, AlertTriangle } from "lucide-react";
import { TestResults } from "./types";

interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: () => void;
  testResults: TestResults;
}

export const CorrectionStep = ({ 
  validationErrors, 
  onApplyCorrections,
  testResults 
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

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Avant correction</h4>
          <div className="space-y-2">
            <p className="text-sm">Engagement: {(testResults.engagement * 100).toFixed(1)}%</p>
            <p className="text-sm">CPA: {testResults.cpa}€</p>
            <p className="text-sm">ROI: {(testResults.roi * 100).toFixed(1)}%</p>
          </div>
        </Card>
      </div>

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