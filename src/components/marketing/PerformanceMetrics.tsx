import { Card } from "@/components/ui/card";

interface PerformanceMetricsProps {
  metrics: {
    engagement?: number;
    leads?: number;
    mandates?: number;
    roi?: number;
  } | null;
}

export const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  if (!metrics) return null;

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-4">Performance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.engagement !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Engagement</p>
            <p className="text-2xl font-semibold">{metrics.engagement}%</p>
          </div>
        )}
        {metrics.leads !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Leads</p>
            <p className="text-2xl font-semibold">{metrics.leads}</p>
          </div>
        )}
        {metrics.mandates !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">Mandats</p>
            <p className="text-2xl font-semibold">{metrics.mandates}</p>
          </div>
        )}
        {metrics.roi !== undefined && (
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <p className="text-2xl font-semibold">{metrics.roi}%</p>
          </div>
        )}
      </div>
    </Card>
  );
};