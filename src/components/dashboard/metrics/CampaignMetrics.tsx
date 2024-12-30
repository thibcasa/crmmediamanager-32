import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from "lucide-react";

interface CampaignMetricsProps {
  campaigns: SocialCampaign[];
}

export const CampaignMetrics = ({ campaigns }: CampaignMetricsProps) => {
  const getMetricsData = () => {
    return campaigns.map(campaign => ({
      name: campaign.name.substring(0, 15) + '...',
      engagement: (campaign.target_metrics?.engagement_rate || 0) * 100,
      conversion: (campaign.target_metrics?.conversion_rate || 0) * 100,
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Performances</h2>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getMetricsData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="engagement" stroke="#8884d8" name="Engagement %" />
            <Line type="monotone" dataKey="conversion" stroke="#82ca9d" name="Conversion %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};