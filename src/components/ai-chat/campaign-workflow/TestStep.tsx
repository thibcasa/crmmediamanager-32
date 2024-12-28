import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube } from "lucide-react";

interface TestStepProps {
  isAnalyzing: boolean;
  onTest: () => void;
  testResults: { roi: number; engagement: number };
  previousResults?: { roi: number; engagement: number };
  iterationCount: number;
}

export const TestStep = ({
  isAnalyzing,
  onTest,
  testResults,
  previousResults,
  iterationCount
}: TestStepProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Test de la campagne</h3>
      <Button onClick={onTest} disabled={isAnalyzing}>
        <TestTube className="mr-2 h-4 w-4" />
        Lancer le test #{iterationCount + 1}
      </Button>
    </Card>
  );
};