import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SocialPlatform } from '@/types/social';
import { Target, Users, Building, ChartBar } from 'lucide-react';

interface StrategySelectorProps {
  platform: SocialPlatform;
  onStrategySelect: (strategy: string) => void;
}

export const StrategySelector = ({ platform, onStrategySelect }: StrategySelectorProps) => {
  const { toast } = useToast();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const strategies = {
    linkedin: [
      {
        id: 'networking',
        name: 'Networking Ciblé',
        icon: <Users className="h-6 w-6" />,
        description: 'Connectez-vous avec des propriétaires et professionnels de l\'immobilier'
      },
      {
        id: 'content',
        name: 'Content Marketing',
        icon: <Building className="h-6 w-6" />,
        description: 'Partagez votre expertise du marché immobilier local'
      }
    ],
    instagram: [
      {
        id: 'visual',
        name: 'Marketing Visuel',
        icon: <ChartBar className="h-6 w-6" />,
        description: 'Créez du contenu visuel attractif pour les biens immobiliers'
      },
      {
        id: 'stories',
        name: 'Stories Immobilières',
        icon: <Target className="h-6 w-6" />,
        description: 'Partagez des moments exclusifs et des visites virtuelles'
      }
    ]
  };

  const handleSelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    onStrategySelect(strategyId);
    toast({
      title: "Stratégie sélectionnée",
      description: "Excellent choix ! Passons maintenant à la création de contenu."
    });
  };

  const platformStrategies = strategies[platform as keyof typeof strategies] || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choisissez votre stratégie pour {platform}</h2>
        <p className="text-muted-foreground mt-2">
          Sélectionnez l'approche qui correspond le mieux à vos objectifs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformStrategies.map((strategy) => (
          <Card
            key={strategy.id}
            className={`p-6 cursor-pointer hover:shadow-lg transition-all ${
              selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(strategy.id)}
          >
            <div className="flex items-center gap-4">
              {strategy.icon}
              <div>
                <h3 className="font-semibold">{strategy.name}</h3>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};