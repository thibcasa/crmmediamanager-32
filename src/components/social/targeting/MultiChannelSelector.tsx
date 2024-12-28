import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Instagram, Linkedin, Twitter, MessageSquare } from 'lucide-react';
import { SocialPlatform } from '@/types/social';

interface Platform {
  id: SocialPlatform;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface MultiChannelSelectorProps {
  selectedPlatforms: SocialPlatform[];
  onPlatformsChange: (platforms: SocialPlatform[]) => void;
}

export const MultiChannelSelector = ({
  selectedPlatforms,
  onPlatformsChange
}: MultiChannelSelectorProps) => {
  const platforms: Platform[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      description: 'Networking professionnel et B2B'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      description: 'Communautés locales et groupes immobiliers'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      description: 'Contenu visuel et Stories'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      description: 'Actualités et tendances marché'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Messages directs et groupes'
    }
  ];

  const handlePlatformToggle = (platformId: SocialPlatform) => {
    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    onPlatformsChange(newPlatforms);
  };

  return (
    <Card className="p-6">
      <Label className="text-lg font-medium mb-4 block">Canaux de diffusion</Label>
      <p className="text-sm text-muted-foreground mb-4">
        Sélectionnez les réseaux sociaux pour votre campagne multi-canal
      </p>

      <div className="grid gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-start space-x-3 p-3 hover:bg-accent rounded-lg transition-colors"
          >
            <Checkbox
              id={platform.id}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => handlePlatformToggle(platform.id)}
            />
            <div className="grid gap-1.5 leading-none">
              <div className="flex items-center gap-2">
                {platform.icon}
                <label
                  htmlFor={platform.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {platform.name}
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                {platform.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};