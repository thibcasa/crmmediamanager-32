import { TestResults } from "../../types/test-results";
import { MetricsCard } from "./MetricsCard";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";

interface MetricsGridProps {
  results: TestResults;
}

export const MetricsGrid = ({ results }: MetricsGridProps) => {
  const metrics = [
    {
      icon: TrendingUp,
      label: "Engagement",
      value: `${(results.engagement * 100).toFixed(1)}%`,
      color: "blue"
    },
    {
      icon: Users,
      label: "Taux de clic",
      value: `${(results.clickRate * 100).toFixed(1)}%`,
      color: "green"
    },
    {
      icon: Target,
      label: "Conversion",
      value: `${(results.conversionRate * 100).toFixed(1)}%`,
      color: "purple"
    },
    {
      icon: DollarSign,
      label: "ROI estimé",
      value: `${(results.roi * 100).toFixed(1)}%`,
      color: "yellow"
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