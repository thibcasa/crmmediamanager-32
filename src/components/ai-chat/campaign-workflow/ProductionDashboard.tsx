import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Rocket } from 'lucide-react';
import { CampaignData } from '../types/campaign';

interface ProductionDashboardProps {
  campaignData: CampaignData;
  onLaunch: () => Promise<void>;
}

export const ProductionDashboard = ({ campaignData, onLaunch }: ProductionDashboardProps) => {
  const isReadyForProduction = campaignData.predictions.roi >= 3 && campaignData.predictions.engagement >= 0.3;

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Mise en Production</h3>
        <p className="text-sm text-muted-foreground">
          Vérifiez et lancez votre campagne
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-2">Créatives</h4>
            <p className="text-2xl font-bold">{campaignData.creatives.length}</p>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-medium mb-2">Contenus</h4>
            <p className="text-2xl font-bold">{campaignData.content.length}</p>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {campaignData.predictions.roi >= 3 ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <p className="text-sm">
              ROI minimum (3x) : {campaignData.predictions.roi.toFixed(1)}x
            </p>
          </div>

          <div className="flex items-center gap-2">
            {campaignData.predictions.engagement >= 0.3 ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <p className="text-sm">
              Engagement minimum (30%) : {(campaignData.predictions.engagement * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <Button
          onClick={onLaunch}
          disabled={!isReadyForProduction}
          className="w-full"
        >
          <Rocket className="mr-2 h-4 w-4" />
          Lancer la campagne
        </Button>

        {!isReadyForProduction && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-yellow-700">
              La campagne n'est pas encore prête pour la production. 
              Veuillez optimiser les métriques pour atteindre les seuils minimums.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
