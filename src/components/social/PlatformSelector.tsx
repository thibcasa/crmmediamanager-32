import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { SocialPlatform } from '@/types/social';

interface PlatformSelectorProps {
  onPlatformSelect: (platform: SocialPlatform) => void;
}

export const PlatformSelector = ({ onPlatformSelect }: PlatformSelectorProps) => {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);

  const platforms: { id: SocialPlatform; name: string; icon: React.ReactNode; description: string }[] = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-8 w-8" />,
      description: 'Idéal pour le networking professionnel et la prospection B2B'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-8 w-8" />,
      description: 'Parfait pour le contenu visuel et l\'engagement immobilier'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-8 w-8" />,
      description: 'Excellent pour cibler les propriétaires locaux'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-8 w-8" />,
      description: 'Pour suivre les tendances du marché immobilier'
    }
  ];

  const handleSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    onPlatformSelect(platform);
    toast({
      title: "Plateforme sélectionnée",
      description: `Vous avez choisi ${platform}. Configurons maintenant votre stratégie.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choisissez votre plateforme</h2>
        <p className="text-muted-foreground mt-2">
          Sélectionnez la plateforme principale pour votre campagne de prospection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={`p-6 cursor-pointer hover:shadow-lg transition-all ${
              selectedPlatform === platform.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(platform.id)}
          >
            <div className="flex items-center gap-4">
              {platform.icon}
              <div>
                <h3 className="font-semibold">{platform.name}</h3>
                <p className="text-sm text-muted-foreground">{platform.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};