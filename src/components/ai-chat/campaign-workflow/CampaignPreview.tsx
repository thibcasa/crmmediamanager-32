import { Card } from "@/components/ui/card";
import { CampaignData } from './CampaignWorkflowManager';

interface CampaignPreviewProps {
  campaignData: CampaignData;
  onUpdate: (updates: Partial<CampaignData>) => void;
}

export const CampaignPreview = ({ campaignData }: CampaignPreviewProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Aperçu de la Campagne</h3>
        <p className="text-sm text-muted-foreground">
          Visualisez votre campagne avant les tests
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Créatives</h4>
          <div className="space-y-4">
            {campaignData.creatives.map((creative, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={creative.url}
                  alt={`Créative ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Contenu</h4>
          <div className="space-y-4">
            {campaignData.content.map((content, index) => (
              <Card key={index} className="p-4">
                <p className="text-sm font-medium mb-2">
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </p>
                <p className="text-sm whitespace-pre-wrap">{content.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};