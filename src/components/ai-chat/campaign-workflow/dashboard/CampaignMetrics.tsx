import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CampaignMetricsProps {
  campaigns: any[];
}

export const CampaignMetrics = ({ campaigns }: CampaignMetricsProps) => {
  const metricsData = campaigns.map(campaign => ({
    name: campaign.name,
    engagement: (campaign.metrics?.engagement || 0) * 100,
    roi: (campaign.metrics?.roi || 0) * 100,
    leads: campaign.metrics?.estimatedLeads || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Engagement Moyen
          </h3>
          <p className="text-2xl font-bold mt-2">
            {((metricsData.reduce((acc, curr) => acc + curr.engagement, 0) / metricsData.length) || 0).toFixed(1)}%
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            ROI Moyen
          </h3>
          <p className="text-2xl font-bold mt-2">
            {((metricsData.reduce((acc, curr) => acc + curr.roi, 0) / metricsData.length) || 0).toFixed(1)}%
          </p>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Leads Totaux
          </h3>
          <p className="text-2xl font-bold mt-2">
            {metricsData.reduce((acc, curr) => acc + curr.leads, 0)}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Évolution des Performances</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#4f46e5" name="Engagement %" />
              <Line type="monotone" dataKey="roi" stroke="#22c55e" name="ROI %" />
              <Line type="monotone" dataKey="leads" stroke="#eab308" name="Leads" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};