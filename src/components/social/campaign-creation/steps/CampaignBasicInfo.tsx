import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface CampaignBasicInfoProps {
  campaignName: string;
  onCampaignNameChange: (value: string) => void;
}

export const CampaignBasicInfo = ({
  campaignName,
  onCampaignNameChange,
}: CampaignBasicInfoProps) => {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Informations de base</h2>
        <p className="text-muted-foreground">
          Donnez un nom à votre campagne de prospection immobilière
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nom de la campagne</label>
        <Input
          value={campaignName}
          onChange={(e) => onCampaignNameChange(e.target.value)}
          placeholder="Ex: Prospection Propriétaires Nice Q2 2024"
        />
      </div>
    </Card>
  );
};