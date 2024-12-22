import { Card } from "@/components/ui/card";
import { Users, Building, ChartBar, Target } from "lucide-react";

interface StrategyStepProps {
  platform: string;
  onStrategySelect: (strategy: string) => void;
}

export const StrategyStep = ({ platform, onStrategySelect }: StrategyStepProps) => {
  const strategies = {
    linkedin: [
      {
        id: 'prospection_directe',
        name: 'Prospection Directe',
        icon: <Users className="h-6 w-6" />,
        description: 'Messages personnalisés aux propriétaires',
        targetingCriteria: {
          location: 'Nice, Alpes-Maritimes',
          jobTitles: ['Propriétaire', 'Investisseur'],
          industries: ['Immobilier', 'Finance']
        }
      },
      {
        id: 'content_marketing',
        name: 'Marketing de Contenu',
        icon: <Building className="h-6 w-6" />,
        description: 'Articles et analyses du marché local',
        targetingCriteria: {
          location: 'Alpes-Maritimes',
          interests: ['Immobilier', 'Investissement'],
          demographics: '35-65'
        }
      }
    ],
    instagram: [
      {
        id: 'visual_showcase',
        name: 'Vitrine Visuelle',
        icon: <ChartBar className="h-6 w-6" />,
        description: 'Photos et stories de biens d\'exception',
        targetingCriteria: {
          location: 'Nice',
          interests: ['Luxe', 'Immobilier'],
          demographics: '35+'
        }
      },
      {
        id: 'local_expertise',
        name: 'Expertise Locale',
        icon: <Target className="h-6 w-6" />,
        description: 'Contenu ciblé sur le marché niçois',
        targetingCriteria: {
          location: 'Nice et environs',
          behavior: 'Intérêt immobilier récent',
          income: 'CSP+'
        }
      }
    ]
  };

  const platformStrategies = strategies[platform as keyof typeof strategies] || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-sage-800">
          Définir votre stratégie pour {platform}
        </h3>
        <p className="text-sm text-sage-600">
          Choisissez l'approche qui correspond le mieux à vos objectifs de prospection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platformStrategies.map((strategy) => (
          <Card
            key={strategy.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-sage-500"
            onClick={() => onStrategySelect(strategy.id)}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sage-100 rounded-lg">
                  {strategy.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sage-900">{strategy.name}</h4>
                  <p className="text-sm text-sage-600">{strategy.description}</p>
                </div>
              </div>
              <div className="mt-2">
                <h5 className="text-xs font-medium text-sage-700 mb-1">Critères de ciblage:</h5>
                <ul className="text-xs text-sage-600 space-y-1">
                  {Object.entries(strategy.targetingCriteria).map(([key, value]) => (
                    <li key={key} className="flex items-center gap-2">
                      <span className="w-20 font-medium">{key}:</span>
                      <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};