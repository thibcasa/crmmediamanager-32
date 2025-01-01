import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { PredictiveAnalysisService } from "@/services/ai/PredictiveAnalysisService";

export const PredictiveDashboard = () => {
  const { data: predictions, isLoading, error } = useQuery({
    queryKey: ['predictive-metrics'],
    queryFn: async () => {
      return PredictiveAnalysisService.analyzeCampaignPerformance('global');
    },
    retry: 1
  });

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-20 animate-pulse bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <div className="h-[300px] animate-pulse bg-gray-200 rounded" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">Une erreur est survenue lors du chargement des prédictions.</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Erreur inconnue'}
        </p>
      </Card>
    );
  }

  if (!predictions?.conversion || !predictions?.roi || !predictions?.marketTrends || !predictions?.trends) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">Aucune donnée prédictive disponible.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Taux de Conversion Prévu</h3>
          <p className="text-2xl font-bold">{predictions.conversion.rate}%</p>
          <p className="text-sm text-muted-foreground">
            Confiance: {(predictions.conversion.confidence * 100).toFixed(1)}%
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">ROI Projeté</h3>
          <p className="text-2xl font-bold">{predictions.roi.predicted}x</p>
          <div className="text-sm text-muted-foreground">
            <p>Min: {predictions.roi.worstCase}x</p>
            <p>Max: {predictions.roi.bestCase}x</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-2">Tendances Marché</h3>
          <p className="text-2xl font-bold">
            {(predictions.marketTrends.demandIndex * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Impact saisonnier: {(predictions.marketTrends.seasonalityImpact * 100).toFixed(1)}%
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Prévisions de Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};