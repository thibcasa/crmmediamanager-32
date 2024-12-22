import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const EXAMPLE_PROMPTS = [
  {
    title: "Campagne LinkedIn Ciblée",
    prompt: "Crée une stratégie de prospection sur LinkedIn pour contacter 50 propriétaires immobiliers dans les Alpes-Maritimes",
    description: "Génère une stratégie complète de messages et connexions LinkedIn"
  },
  {
    title: "Campagne Multi-Réseaux",
    prompt: "Crée une stratégie marketing combinant LinkedIn et Instagram pour obtenir 8 mandats cette semaine",
    description: "Orchestration de messages cohérents sur LinkedIn et Instagram"
  },
  {
    title: "Workflow Automatisé",
    prompt: "Génère un workflow complet de nurturing LinkedIn pour convertir les prospects en mandats",
    description: "Création d'un parcours automatisé de conversion"
  },
  {
    title: "Contenu Engageant",
    prompt: "Propose une série de posts LinkedIn et Instagram ciblant les propriétaires immobiliers",
    description: "Concepts créatifs et scripts pour les réseaux sociaux"
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
          className="p-4 hover:bg-sage-50 transition-colors cursor-pointer border-sage-200"
          onClick={() => onPromptClick(prompt.prompt)}
        >
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-sage-600 mt-1" />
            <div>
              <h3 className="font-semibold text-sage-800">{prompt.title}</h3>
              <p className="text-sm text-sage-600 mt-1">{prompt.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};