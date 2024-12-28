import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, AlertCircle } from "lucide-react";
import { TestResults } from "../types/test-results";

interface ProductionStepProps {
  onDeploy: () => void;
  testResults: TestResults;
  iterationHistory: TestResults[];
  canProceed: boolean;
}

export const ProductionStep = ({ 
  onDeploy, 
  testResults,
  iterationHistory,
  canProceed 
}: ProductionStepProps) => {
  const checklistItems = [
    { 
      label: "ROI estimé suffisant",
      checked: testResults.roi >= 2,
      value: `${(testResults.roi * 100).toFixed(1)}%`
    },
    { 
      label: "Engagement optimal",
      checked: testResults.engagement >= 0.6,
      value: `${(testResults.engagement * 100).toFixed(1)}%`
    },
    { 
      label: "CPA optimisé",
      checked: testResults.cpa <= 12,
      value: `${testResults.cpa}€`
    },
    { 
      label: "Taux de conversion satisfaisant",
      checked: testResults.conversionRate >= 0.03,
      value: `${(testResults.conversionRate * 100).toFixed(1)}%`
    }
  ];

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
              <p className="text-sm font-medium text-green-800">Engagement final</p>
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

          <div className="border-t border-green-200 pt-4">
            <h5 className="text-sm font-medium text-green-800 mb-2">Checklist finale</h5>
            <ul className="space-y-2">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    {item.checked ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    {item.label}
                  </div>
                  <span className="font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-green-200 pt-4">
            <h5 className="text-sm font-medium text-green-800 mb-2">Opportunités identifiées</h5>
            <ul className="space-y-2">
              {testResults.opportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-green-700 flex items-center gap-2">
                  <Rocket className="h-4 w-4" />
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Button
        onClick={onDeploy}
        disabled={!canProceed}
        className="w-full flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700"
      >
        <Rocket className="h-4 w-4" />
        Mettre en production
      </Button>

      {!canProceed && (
        <p className="text-sm text-yellow-600 text-center">
          Continuez les itérations pour atteindre les objectifs minimums de performance
        </p>
      )}
    </div>
  );
};