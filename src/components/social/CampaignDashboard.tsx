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
      // Ensure schedule has the correct type
      return {
        ...data,
        schedule: typeof data.schedule === 'string' 
          ? { frequency: 'daily' } 
          : data.schedule || { frequency: 'daily' }
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