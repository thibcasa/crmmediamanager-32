import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { Facebook, Instagram, Linkedin, Twitter, MessageSquare } from 'lucide-react';

interface CampaignListProps {
  campaigns: SocialCampaign[];
  onSelectCampaign: (campaign: SocialCampaign) => void;
  onUpdate: (campaign: SocialCampaign) => void;
}

export const CampaignList = ({ campaigns, onSelectCampaign }: CampaignListProps) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.id}
          className="p-4 hover:bg-accent/50 transition-colors cursor-pointer relative group"
          onClick={() => onSelectCampaign(campaign)}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getPlatformIcon(campaign.platform)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium group-hover:text-primary transition-colors">
                {campaign.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Créée le {new Date(campaign.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs text-muted-foreground">
                Cliquez pour voir les détails →
              </span>
            </div>
          </div>
        </Card>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Aucune campagne trouvée</p>
        </div>
      )}
    </div>
  );
};