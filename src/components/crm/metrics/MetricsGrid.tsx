import { Users, Target, TrendingUp, MessageSquare } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface MetricsGridProps {
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    activeInteractions: number;
    conversionRate: string | number;
  };
}

export const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Contacts</p>
            <p className="text-2xl font-bold">{metrics.totalLeads}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Target className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Contacts Qualifiés</p>
            <p className="text-2xl font-bold">{metrics.qualifiedLeads}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Interactions Actives</p>
            <p className="text-2xl font-bold">{metrics.activeInteractions}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Taux de Conversion</p>
            <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};