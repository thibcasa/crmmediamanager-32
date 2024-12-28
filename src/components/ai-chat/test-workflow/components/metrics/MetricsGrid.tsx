import { Card } from "@/components/ui/card";
import { TestResults } from "../../types/test-results";
import { MetricsCard } from "./MetricsCard";
import { TrendingUp, Users, Target, DollarSign, LineChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricsGridProps {
  results: TestResults;
  previousResults?: TestResults;
}

export const MetricsGrid = ({ results, previousResults }: MetricsGridProps) => {
  const calculateTrend = (current: number, previous?: number) => {
    if (!previous) return undefined;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      icon: TrendingUp,
      label: "Engagement",
      value: `${(results.engagement * 100).toFixed(1)}%`,
      color: "blue",
      trend: calculateTrend(results.engagement, previousResults?.engagement)
    },
    {
      icon: Users,
      label: "Taux de clic",
      value: `${(results.clickRate * 100).toFixed(1)}%`,
      color: "green",
      trend: calculateTrend(results.clickRate, previousResults?.clickRate)
    },
    {
      icon: Target,
      label: "Conversion",
      value: `${(results.conversionRate * 100).toFixed(1)}%`,
      color: "purple",
      trend: calculateTrend(results.conversionRate, previousResults?.conversionRate)
    },
    {
      icon: DollarSign,
      label: "ROI estimé",
      value: `${(results.roi * 100).toFixed(1)}%`,
      color: "yellow",
      trend: calculateTrend(results.roi, previousResults?.roi)
    }
  ];

  // Données pour le graphique d'évolution
  const chartData = previousResults ? [
    {
      name: 'Précédent',
      engagement: previousResults.engagement * 100,
      conversion: previousResults.conversionRate * 100,
      roi: previousResults.roi * 100
    },
    {
      name: 'Actuel',
      engagement: results.engagement * 100,
      conversion: results.conversionRate * 100,
      roi: results.roi * 100
    }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>

      {previousResults && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-4">Évolution des métriques</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" name="Engagement" stroke="#4f46e5" />
                <Line type="monotone" dataKey="conversion" name="Conversion" stroke="#22c55e" />
                <Line type="monotone" dataKey="roi" name="ROI" stroke="#eab308" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};