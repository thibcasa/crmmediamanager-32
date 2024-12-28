import { Card } from "@/components/ui/card";

interface CampaignHeaderProps {
  iterationCount: number;
}

export const CampaignHeader = ({ iterationCount }: CampaignHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Test & Validation</h3>
      <div className="text-sm text-muted-foreground">
        Itération {iterationCount}
      </div>
    </div>
  );
};