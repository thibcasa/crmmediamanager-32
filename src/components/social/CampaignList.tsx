import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle, Send, Calendar, Target } from 'lucide-react';

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Send,
  whatsapp: MessageCircle,
};

interface CampaignListProps {
  campaigns: SocialCampaign[];
  onSelectCampaign: (campaign: SocialCampaign) => void;
}

export const CampaignList = ({ campaigns, onSelectCampaign }: CampaignListProps) => {
  const getPlatformIcon = (platformName: string) => {
    const Icon = platformIcons[platformName as keyof typeof platformIcons] || Send;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card 
          key={campaign.id} 
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectCampaign(campaign)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {getPlatformIcon(campaign.platform)}
              <div>
                <h4 className="font-medium">{campaign.name}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    {campaign.targeting_criteria ? Object.keys(campaign.targeting_criteria).length : 0} critères
                  </span>
                  {campaign.schedule && (
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Planifié
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
              campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {campaign.status}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};