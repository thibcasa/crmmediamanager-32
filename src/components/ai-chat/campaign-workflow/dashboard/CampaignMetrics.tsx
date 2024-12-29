import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CampaignMetricsProps {
  campaigns: any[];
  onCampaignClick: (campaignId: string) => void;
}

export const CampaignMetrics = ({ campaigns, onCampaignClick }: CampaignMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {campaigns.map((campaign) => (
        <Card 
          key={campaign.id} 
          className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => onCampaignClick(campaign.id)}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                Créée le {new Date(campaign.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status === 'active' ? 'Active' : 'En pause'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Engagement</p>
              <p className="text-2xl font-bold">
                {((campaign.metrics?.engagement || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">ROI</p>
              <p className="text-2xl font-bold">
                {((campaign.metrics?.roi || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};