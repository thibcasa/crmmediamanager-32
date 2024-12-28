import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowRight } from "lucide-react";
import { CorrectionStepProps } from "./types/correction-step";
import { DetailedReport } from "./DetailedReport";
import { TestMetrics } from "../TestMetrics";

export const CorrectionStep = ({ 
  validationErrors, 
  onApplyCorrections,
  testResults,
  previousResults
}: CorrectionStepProps) => {
  return (
    <div className="space-y-6">
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

      {previousResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-4">Itération précédente</h4>
              <TestMetrics results={previousResults} />
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-4">Après corrections</h4>
              <TestMetrics results={testResults} />
            </Card>
          </div>
          
          {testResults.iterationMetrics?.improvementRate && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">
                  Amélioration de {testResults.iterationMetrics.improvementRate.toFixed(1)}% par rapport à l'itération précédente
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      <DetailedReport before={previousResults || testResults} after={testResults} />

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Itération {testResults.iterationMetrics?.iterationCount || 1}
        </p>
        <Button
          variant="outline"
          onClick={onApplyCorrections}
          className="flex items-center gap-2"
        >
          <Wrench className="h-4 w-4" />
          Appliquer les corrections et relancer le test
        </Button>
      </div>
    </div>
  );
};