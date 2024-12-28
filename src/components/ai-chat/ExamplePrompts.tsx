import { Card } from "@/components/ui/card";
import { Sparkles, Building, Home, TrendingUp, Users, Target, Calendar, MapPin, Banknote, Camera } from "lucide-react";

export const EXAMPLE_PROMPTS = [
  {
    category: "Prospection Ciblée",
    title: "Stratégie LinkedIn Premium",
    prompt: "Crée une stratégie de prospection sur LinkedIn pour contacter 30 propriétaires de villas avec piscine à Nice et Cannes",
    description: "Génère une stratégie de messages personnalisés pour LinkedIn",
    icon: Target
  },
  {
    category: "Multi-Réseaux",
    title: "Campagne Intégrée",
    prompt: "Crée une stratégie marketing combinant LinkedIn et Instagram pour obtenir 5 mandats ce mois-ci dans le secteur de Nice Nord",
    description: "Plan d'action sur LinkedIn et Instagram",
    icon: Building
  },
  {
    category: "Contenu Engageant",
    title: "Posts Immobiliers",
    prompt: "Génère 5 idées de posts Instagram mettant en avant les avantages fiscaux de l'investissement immobilier à Nice",
    description: "Création de contenu éducatif et attractif",
    icon: Home
  },
  {
    category: "Événements",
    title: "Portes Ouvertes",
    prompt: "Crée une stratégie de communication pour organiser une journée portes ouvertes pour 3 biens d'exception à Nice",
    description: "Plan de promotion d'événement immobilier",
    icon: Calendar
  },
  {
    category: "Analyse Marché",
    title: "Rapport Tendances",
    prompt: "Analyse les tendances actuelles du marché immobilier de luxe dans les Alpes-Maritimes et génère un rapport détaillé",
    description: "Création d'un rapport d'analyse de marché",
    icon: TrendingUp
  },
  {
    category: "Networking",
    title: "Partenariats Locaux",
    prompt: "Développe une stratégie pour créer des partenariats avec des architectes et décorateurs d'intérieur de la Côte d'Azur",
    description: "Plan de développement réseau professionnel",
    icon: Users
  },
  {
    category: "Secteurs Premium",
    title: "Ciblage Cap d'Antibes",
    prompt: "Crée une stratégie de prospection spécifique pour les propriétaires de villas au Cap d'Antibes avec un budget > 5M€",
    description: "Plan de prospection zone premium",
    icon: MapPin
  },
  {
    category: "Investissement",
    title: "Rentabilité Locative",
    prompt: "Génère une analyse détaillée de la rentabilité locative des appartements de standing dans le Carré d'Or à Nice",
    description: "Analyse financière et ROI",
    icon: Banknote
  },
  {
    category: "Visuel",
    title: "Shooting Pro",
    prompt: "Crée un guide pour optimiser les photos et vidéos de biens de luxe, incluant les prises de vue par drone",
    description: "Guide photo et vidéo professionnel",
    icon: Camera
  }
];

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
}

export const ExamplePrompts = ({ onPromptClick }: ExamplePromptsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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