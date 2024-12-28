import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface CampaignHistoryProps {
  campaigns: any[];
}

export const CampaignHistory = ({ campaigns }: CampaignHistoryProps) => {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                Créée le {format(new Date(campaign.created_at), 'dd/MM/yyyy')}
              </p>
            </div>
            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
              {campaign.status === 'active' ? 'Active' : 'Terminée'}
            </Badge>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Engagement</p>
              <p className="text-lg">
                {((campaign.metrics?.engagement || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">ROI</p>
              <p className="text-lg">
                {((campaign.metrics?.roi || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Leads</p>
              <p className="text-lg">
                {campaign.metrics?.estimatedLeads || 0}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};