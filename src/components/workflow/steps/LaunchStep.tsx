import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface LaunchStepProps {
  config: {
    platform: string;
    strategy: string;
    format: string;
  };
  onLaunch: () => void;
  isProcessing: boolean;
}

export const LaunchStep = ({ config, onLaunch, isProcessing }: LaunchStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-sage-800">Vérifier et lancer la campagne</h3>
        <p className="text-sm text-sage-600">Confirmez les paramètres de votre campagne</p>
      </div>

      <Card className="p-6 bg-sage-50 border-sage-200">
        <h4 className="font-medium text-sage-800 mb-4">Récapitulatif de la configuration</h4>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-sage-600">Plateforme</dt>
            <dd className="font-medium text-sage-800 mt-1 capitalize">{config.platform}</dd>
          </div>
          <div>
            <dt className="text-sm text-sage-600">Stratégie</dt>
            <dd className="font-medium text-sage-800 mt-1 capitalize">
              {config.strategy.replace('_', ' ')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-sage-600">Format</dt>
            <dd className="font-medium text-sage-800 mt-1 capitalize">{config.format}</dd>
          </div>
        </dl>
      </Card>

      <Button
        onClick={onLaunch}
        disabled={isProcessing}
        className="w-full h-12 bg-sage-600 hover:bg-sage-700 text-white flex items-center justify-center gap-2"
      >
        <Rocket className="w-5 h-5" />
        {isProcessing ? "Création en cours..." : "Lancer la campagne"}
      </Button>
    </div>
  );
};