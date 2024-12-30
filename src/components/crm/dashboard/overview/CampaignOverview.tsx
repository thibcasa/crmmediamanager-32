import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { BarChart, Calendar, Target } from "lucide-react";

interface CampaignOverviewProps {
  campaigns: SocialCampaign[];
}

export const CampaignOverview = ({ campaigns }: CampaignOverviewProps) => {
  const getAveragePerformance = (campaign: SocialCampaign) => {
    if (!campaign.ai_feedback?.performance_score) return 0;
    return campaign.ai_feedback.performance_score * 100;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Vue d'ensemble des campagnes</h3>
      
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{campaign.name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Créée le {new Date(campaign.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {campaign.status === 'active' ? 'Active' : 'En pause'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  <span className="text-sm">
                    {getAveragePerformance(campaign).toFixed(0)}% Performance
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};