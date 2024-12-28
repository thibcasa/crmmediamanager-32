import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionStepProps {
  isAnalyzing: boolean;
  progress: number;
  testResults: { roi: number; engagement: number };
  onAnalyze: () => void;
  messageToTest?: string;
  iterationCount: number;
}

export const PredictionStep = ({ 
  isAnalyzing,
  progress,
  testResults,
  onAnalyze,
  messageToTest,
  iterationCount
}: PredictionStepProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Prédiction des performances</h3>
      {isAnalyzing && (
        <Progress value={progress} className="w-full mb-4" />
      )}
      <div className="space-y-4">
        <p>Itération #{iterationCount}</p>
        <p>ROI estimé: {testResults.roi}x</p>
        <p>Engagement estimé: {(testResults.engagement * 100).toFixed(1)}%</p>
      </div>
    </Card>
  );
};