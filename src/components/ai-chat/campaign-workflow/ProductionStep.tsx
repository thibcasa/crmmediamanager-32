import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface ProductionStepProps {
  onDeploy: () => void;
  testResults: { roi: number; engagement: number };
  iterationHistory: { roi: number; engagement: number }[];
  canProceed: boolean;
}

export const ProductionStep = ({
  onDeploy,
  testResults,
  iterationHistory,
  canProceed
}: ProductionStepProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Mise en production</h3>
      <Button onClick={onDeploy} disabled={!canProceed}>
        <Rocket className="mr-2 h-4 w-4" />
        Déployer en production
      </Button>
    </Card>
  );
};