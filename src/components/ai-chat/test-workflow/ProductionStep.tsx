import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle } from "lucide-react";
import { TestResults } from "./types";

interface ProductionStepProps {
  onDeploy: () => void;
  testResults: TestResults;
}

export const ProductionStep = ({ onDeploy, testResults }: ProductionStepProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h4 className="font-medium text-green-800">Campagne prête pour la production</h4>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-green-800">Engagement estimé</p>
              <p className="text-2xl font-bold text-green-900">
                {(testResults.engagement * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">ROI estimé</p>
              <p className="text-2xl font-bold text-green-900">
                {(testResults.roi * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {testResults.opportunities.map((opportunity, index) => (
              <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Button
        onClick={onDeploy}
        className="w-full flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700"
      >
        <Rocket className="h-4 w-4" />
        Mettre en production
      </Button>
    </div>
  );
};