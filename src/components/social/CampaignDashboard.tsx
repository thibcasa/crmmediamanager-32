import { useAutomaticOptimization } from "@/hooks/useAutomaticOptimization";
import { OptimizationPanel } from "./OptimizationPanel";
import { CampaignAnalytics } from "./CampaignAnalytics";

interface CampaignDashboardProps {
  campaignId: string;
}

export const CampaignDashboard = ({ campaignId }: CampaignDashboardProps) => {
  useAutomaticOptimization(campaignId);

  return (
    <div className="space-y-6">
      <CampaignAnalytics campaign={{ id: campaignId }} />
      <OptimizationPanel />
    </div>
  );
};