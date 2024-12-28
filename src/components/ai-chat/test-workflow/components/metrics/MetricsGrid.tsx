import { TestResults } from "../../types/test-results";
import { MetricsCard } from "./MetricsCard";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricsCard key={index} {...metric} />
      ))}
    </div>
  );
};