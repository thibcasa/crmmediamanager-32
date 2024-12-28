import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
  trend?: number;
}

export const MetricsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = "blue",
  trend 
}: MetricsCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 text-${color}-500`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {trend !== undefined && (
        <p className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </p>
      )}
    </Card>
  );
};