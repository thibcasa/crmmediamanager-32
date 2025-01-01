import { useAutomaticOptimization } from "@/hooks/useAutomaticOptimization";
import { OptimizationPanel } from "./OptimizationPanel";
import { CampaignAnalytics } from "./CampaignAnalytics";
import { useQuery } from "@tanstack/react-query";
import { SocialCampaignService } from "@/services/SocialCampaignService";
import { SocialCampaign } from "@/types/social";

interface CampaignDashboardProps {
  campaignId: string;
}

export const CampaignDashboard = ({ campaignId }: CampaignDashboardProps) => {
  useAutomaticOptimization(campaignId);

  const { data: campaign } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const data = await SocialCampaignService.getCampaign(campaignId);
      return {
        ...data,
        content_strategy: data.content_strategy ? {
          post_types: (data.content_strategy as any).post_types || [],
          posting_frequency: (data.content_strategy as any).posting_frequency || 'daily'
        } : {
          post_types: [],
          posting_frequency: 'daily'
        }
      } as SocialCampaign;
    },
  });

  if (!campaign) {
    return <div>Chargement de la campagne...</div>;
  }

  return (
    <div className="space-y-6">
      <CampaignAnalytics campaign={campaign} />
      <OptimizationPanel />
    </div>
  );
};