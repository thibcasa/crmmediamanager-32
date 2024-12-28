import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, ArrowRight } from "lucide-react";
import { TestResults } from "./types";

interface TestStepProps {
  isAnalyzing: boolean;
  onTest: () => void;
  testResults: TestResults;
}

export const TestStep = ({ isAnalyzing, onTest, testResults }: TestStepProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Avant correction</h4>
          <div className="space-y-2">
            <p className="text-sm">Engagement: {(testResults.engagement * 100).toFixed(1)}%</p>
            <p className="text-sm">CPA: {testResults.cpa}€</p>
            <p className="text-sm">ROI: {(testResults.roi * 100).toFixed(1)}%</p>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-2">Après correction</h4>
          <div className="space-y-2">
            <p className="text-sm">Engagement: {((testResults.engagement * 1.2) * 100).toFixed(1)}%</p>
            <p className="text-sm">CPA: {(testResults.cpa * 0.8).toFixed(1)}€</p>
            <p className="text-sm">ROI: {((testResults.roi * 1.3) * 100).toFixed(1)}%</p>
          </div>
        </Card>
      </div>

      <Button
        variant="outline"
        onClick={onTest}
        disabled={isAnalyzing}
        className="w-full flex items-center gap-2 justify-center"
      >
        <TestTube className="h-4 w-4" />
        Tester les corrections
      </Button>
    </div>
  );
};