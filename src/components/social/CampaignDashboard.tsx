import { useAutomaticOptimization } from "@/hooks/useAutomaticOptimization";
import { OptimizationPanel } from "./OptimizationPanel";
import { CampaignAnalytics } from "./CampaignAnalytics";
import { useQuery } from "@tanstack/react-query";
import { SocialCampaignService } from "@/services/SocialCampaignService";

interface CampaignDashboardProps {
  campaignId: string;
}

export const CampaignDashboard = ({ campaignId }: CampaignDashboardProps) => {
  useAutomaticOptimization(campaignId);

  const { data: campaign } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => SocialCampaignService.getCampaign(campaignId),
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