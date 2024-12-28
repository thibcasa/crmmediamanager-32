import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  trend?: number;
}

export const MetricsCard = ({ icon: Icon, label, value, color, trend }: MetricsCardProps) => {
  const getColorClass = (color: string) => {
    const colors = {
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      yellow: "text-yellow-500"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${getColorClass(color)}`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {trend > 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend).toFixed(1)}%
          </p>
        </div>
      )}
    </Card>
  );
};