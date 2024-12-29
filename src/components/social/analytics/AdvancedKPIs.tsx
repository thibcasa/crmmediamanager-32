import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { PredictiveAnalysisService } from '@/services/ai/PredictiveAnalysisService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AdvancedKPIsProps {
  campaignId: string;
}

export const AdvancedKPIs = ({ campaignId }: AdvancedKPIsProps) => {
  const { data: predictions } = useQuery({
    queryKey: ['campaign-predictions', campaignId],
    queryFn: () => PredictiveAnalysisService.analyzeCampaignPerformance(campaignId)
  });

  if (!predictions) return null;

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-medium">Analyse Prédictive</h3>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Engagement Prévu</p>
          <p className="text-2xl font-bold">{predictions.engagement.rate}%</p>
          <p className="text-sm text-muted-foreground">
            Confiance: {predictions.engagement.confidence * 100}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">ROI Projeté</p>
          <p className="text-2xl font-bold">{predictions.roi.predicted}x</p>
          <div className="text-sm text-muted-foreground">
            <p>Min: {predictions.roi.worstCase}x</p>
            <p>Max: {predictions.roi.bestCase}x</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Tendances Marché</p>
          <p className="text-2xl font-bold">
            {(predictions.marketTrends.demandIndex * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Impact saisonnier: {(predictions.marketTrends.seasonalityImpact * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={predictions.engagement.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              name="Engagement"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};