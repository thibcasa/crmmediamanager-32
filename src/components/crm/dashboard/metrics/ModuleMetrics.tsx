import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ModuleMetricsProps {
  campaigns: SocialCampaign[];
}

export const ModuleMetrics = ({ campaigns }: ModuleMetricsProps) => {
  const getMetricsData = () => {
    return campaigns.map(campaign => ({
      name: campaign.name,
      performance: (campaign.ai_feedback?.performance_score || 0) * 100,
      engagement: (campaign.target_metrics?.engagement_rate || 0) * 100,
      conversion: (campaign.target_metrics?.conversion_rate || 0) * 100
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Métriques des modules</h3>
      
      <Card className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getMetricsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="performance" stroke="#8884d8" name="Performance" />
              <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement" />
              <Line type="monotone" dataKey="conversion" stroke="#ffc658" name="Conversion" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};