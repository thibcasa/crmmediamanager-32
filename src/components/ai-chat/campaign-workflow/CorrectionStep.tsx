import { Card } from "@/components/ui/card";

interface CorrectionStepProps {
  validationErrors: string[];
  onApplyCorrections: () => void;
  testResults: { roi: number; engagement: number };
  previousResults?: { roi: number; engagement: number };
}

export const CorrectionStep = ({
  validationErrors,
  onApplyCorrections,
  testResults,
  previousResults
}: CorrectionStepProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Corrections suggérées</h3>
      {validationErrors.length > 0 ? (
        <ul className="list-disc pl-4">
          {validationErrors.map((error, index) => (
            <li key={index} className="text-red-500">{error}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune correction nécessaire</p>
      )}
    </Card>
  );
};