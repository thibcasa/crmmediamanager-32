import { Card } from "@/components/ui/card";
import { Sparkles, Building, Home, TrendingUp, Users } from "lucide-react";

export const EXAMPLE_PROMPTS = [
  {
    category: "Immobilier de Luxe",
    title: "Campagne LinkedIn Ciblée",
    prompt: "Crée une stratégie de prospection sur LinkedIn pour contacter 50 propriétaires de biens de luxe dans les Alpes-Maritimes",
    description: "Génère une stratégie complète de messages et connexions LinkedIn",
    icon: Building
  },
  {
    category: "Résidentiel",
    title: "Campagne Multi-Réseaux",
    prompt: "Crée une stratégie marketing combinant LinkedIn et Instagram pour obtenir 8 mandats cette semaine dans le secteur résidentiel",
    description: "Orchestration de messages cohérents sur LinkedIn et Instagram",
    icon: Home
  },
  {
    category: "Analyse de Marché",
    title: "Tendances du Marché",
    prompt: "Analyse les tendances actuelles du marché immobilier dans les Alpes-Maritimes et génère un rapport détaillé",
    description: "Création d'un rapport d'analyse de marché complet",
    icon: TrendingUp
  },
  {
    category: "Networking",
    title: "Stratégie de Networking",
    prompt: "Développe une stratégie de networking pour créer des partenariats avec des agents immobiliers locaux",
    description: "Plan de développement de réseau professionnel",
    icon: Users
  }
];

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
}

export const ExamplePrompts = ({ onPromptClick }: ExamplePromptsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {EXAMPLE_PROMPTS.map((prompt, index) => (
        <Card 
          key={index}
          className="p-4 hover:bg-sage-50 transition-colors cursor-pointer border-sage-200 group"
          onClick={() => onPromptClick(prompt.prompt)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <prompt.icon className="h-5 w-5 text-sage-600 mt-1" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-sage-500">
                  {prompt.category}
                </span>
                <Sparkles className="h-3 w-3 text-sage-400" />
              </div>
              <h3 className="font-semibold text-sage-800 mt-1">{prompt.title}</h3>
              <p className="text-sm text-sage-600 mt-1">{prompt.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};