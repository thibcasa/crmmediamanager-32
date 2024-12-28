import { AlertCircle } from 'lucide-react';
import { CampaignData } from '../../../types/campaign';

interface PerformanceAlertProps {
  predictions: CampaignData['predictions'];
}

export const PerformanceAlert = ({ predictions }: PerformanceAlertProps) => {
  if (predictions.roi === 0 || predictions.roi >= 3) return null;

  return (
    <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <p className="text-sm text-yellow-700">
        Le ROI est inférieur à 3. Des optimisations sont recommandées avant la mise en production.
      </p>
    </div>
  );
};