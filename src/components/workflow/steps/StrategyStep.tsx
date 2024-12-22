import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Platform } from "@/services/SocialCampaignService";
import { Building2, Users, Target, Megaphone } from "lucide-react";

interface StrategyStepProps {
  platform: Platform;
  onStrategySelect: (strategy: string) => void;
}

interface StrategyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const StrategyStep = ({ platform, onStrategySelect }: StrategyStepProps) => {
  const strategies: Record<Platform, StrategyOption[]> = {
    linkedin: [
      {
        id: "b2b_prospection",
        title: "Prospection B2B",
        description: "Identifiez et contactez les propriétaires d'entreprises",
        icon: <Building2 className="w-6 h-6" />
      },
      {
        id: "network_growth",
        title: "Croissance du réseau",
        description: "Développez votre réseau professionnel immobilier",
        icon: <Users className="w-6 h-6" />
      },
      {
        id: "thought_leadership",
        title: "Leadership d'opinion",
        description: "Positionnez-vous comme expert immobilier",
        icon: <Target className="w-6 h-6" />
      }
    ],
    instagram: [
      {
        id: "local_visibility",
        title: "Visibilité locale",
        description: "Augmentez votre visibilité dans les Alpes-Maritimes",
        icon: <Target className="w-6 h-6" />
      },
      {
        id: "community_building",
        title: "Construction communautaire",
        description: "Créez une communauté de propriétaires engagés",
        icon: <Users className="w-6 h-6" />
      },
      {
        id: "property_showcase",
        title: "Mise en valeur immobilière",
        description: "Présentez des biens et succès immobiliers",
        icon: <Megaphone className="w-6 h-6" />
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Choisir votre stratégie</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez l'approche la plus adaptée à vos objectifs
        </p>
      </div>
      <div className="grid gap-4">
        {strategies[platform].map((strategy) => (
          <Card 
            key={strategy.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => onStrategySelect(strategy.id)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {strategy.icon}
              </div>
              <div>
                <h4 className="font-medium">{strategy.title}</h4>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};