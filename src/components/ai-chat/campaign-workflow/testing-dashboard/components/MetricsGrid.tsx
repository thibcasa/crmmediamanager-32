import { Card } from "@/components/ui/card";
import { CampaignData } from '../../../types/campaign';

interface MetricsGridProps {
  predictions: CampaignData['predictions'];
}

export const MetricsGrid = ({ predictions }: MetricsGridProps) => {
  if (predictions.engagement === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4">
        <p className="text-sm font-medium">Engagement estimé</p>
        <p className="text-2xl font-bold">
          {(predictions.engagement * 100).toFixed(1)}%
        </p>
      </Card>
      
      <Card className="p-4">
        <p className="text-sm font-medium">Coût par lead</p>
        <p className="text-2xl font-bold">
          {predictions.costPerLead.toFixed(2)}€
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium">ROI estimé</p>
        <p className="text-2xl font-bold">
          {predictions.roi.toFixed(1)}x
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium">Leads estimés</p>
        <p className="text-2xl font-bold">
          {Math.round(predictions.estimatedLeads)}
        </p>
      </Card>
    </div>
  );
};