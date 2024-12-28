import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export const MetricsCard = ({ icon: Icon, label, value, color = "blue" }: MetricsCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 text-${color}-500`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
};