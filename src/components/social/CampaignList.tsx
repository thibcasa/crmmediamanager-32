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
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectCampaign(campaign)}
        >
          <div className="flex items-center space-x-4">
            {getPlatformIcon(campaign.platform)}
            <div>
              <h3 className="font-medium">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                Créée le {new Date(campaign.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};