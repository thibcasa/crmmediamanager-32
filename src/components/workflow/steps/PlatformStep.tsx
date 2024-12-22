import { Button } from "@/components/ui/button";
import { LinkedinIcon, InstagramIcon, Facebook, Twitter, MessageSquare } from "lucide-react";
import { Platform } from "@/services/SocialCampaignService";
import { Card } from "@/components/ui/card";

interface PlatformStepProps {
  onPlatformSelect: (platform: Platform) => void;
}

export const PlatformStep = ({ onPlatformSelect }: PlatformStepProps) => {
  const platforms = [
    {
      id: 'linkedin' as Platform,
      name: 'LinkedIn',
      icon: <LinkedinIcon className="w-8 h-8 text-sage-600" />,
      description: 'Prospection B2B ciblée des propriétaires et professionnels'
    },
    {
      id: 'instagram' as Platform,
      name: 'Instagram',
      icon: <InstagramIcon className="w-8 h-8 text-sage-600" />,
      description: 'Visibilité locale et contenu visuel immobilier'
    },
    {
      id: 'facebook' as Platform,
      name: 'Facebook',
      icon: <Facebook className="w-8 h-8 text-sage-600" />,
      description: 'Ciblage local des propriétaires et groupes immobiliers'
    },
    {
      id: 'twitter' as Platform,
      name: 'Twitter',
      icon: <Twitter className="w-8 h-8 text-sage-600" />,
      description: 'Actualités et tendances du marché immobilier'
    },
    {
      id: 'whatsapp' as Platform,
      name: 'WhatsApp',
      icon: <MessageSquare className="w-8 h-8 text-sage-600" />,
      description: 'Communication directe et groupes de propriétaires'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-sage-800">Choisir la plateforme de diffusion</h3>
        <p className="text-sm text-sage-600">Sélectionnez la plateforme la plus adaptée à votre audience</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-sage-500"
            onClick={() => onPlatformSelect(platform.id)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {platform.icon}
              <div>
                <h4 className="font-medium text-lg mb-2">{platform.name}</h4>
                <p className="text-sm text-sage-600">{platform.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};