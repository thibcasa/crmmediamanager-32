import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Edit2, Image, MessageSquare, PieChart, Settings, Share2, Workflow, Users, Mail, Share, FileText, Heading } from "lucide-react";
import { useNavigate } from "react-router-dom";

const modules = [
  { id: 'leads', name: 'Gestion des Leads', icon: Users, route: '/leads' },
  { id: 'email', name: 'Email Marketing', icon: Mail, route: '/email' },
  { id: 'social', name: 'Réseaux Sociaux', icon: Share, route: '/social' },
  // Workflow modules in order
  { 
    id: 'subject', 
    name: 'Module Sujet', 
    icon: MessageSquare, 
    route: '/modules/subject',
    description: 'Étape 1: Définir le sujet principal'
  },
  { 
    id: 'title', 
    name: 'Module Titre', 
    icon: Heading, 
    route: '/modules/title',
    description: 'Étape 2: Générer des titres optimisés'
  },
  { 
    id: 'content', 
    name: 'Module Rédaction', 
    icon: FileText, 
    route: '/modules/content',
    description: 'Étape 3: Créer le contenu complet'
  },
  { id: 'creative', name: 'Module Créatif', icon: Image, route: '/modules/creative' },
  { id: 'workflow', name: 'Module Workflow', icon: Workflow, route: '/modules/workflow' },
  { id: 'pipeline', name: 'Module Pipeline', icon: Share2, route: '/modules/pipeline' },
  { id: 'analysis', name: 'Module Analyse', icon: PieChart, route: '/modules/analysis' },
  { id: 'settings', name: 'Configuration API', icon: Settings, route: '/settings/api' },
];

export const ModuleNavigation = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Navigation Modules</h2>
      </div>

      <div className="space-y-4">
        {/* Workflow modules first with special styling */}
        <div className="space-y-2 mb-6 border-b pb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Workflow de Création</h3>
          {modules.slice(3, 6).map((module) => (
            <Button
              key={module.id}
              variant="outline"
              className="w-full justify-start relative group"
              onClick={() => navigate(module.route)}
            >
              <module.icon className="h-4 w-4 mr-2" />
              <div>
                <span>{module.name}</span>
                <span className="text-xs text-muted-foreground block">
                  {module.description}
                </span>
              </div>
            </Button>
          ))}
        </div>

        {/* Other modules */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Autres Modules</h3>
          {modules.filter((_, index) => index < 3 || index > 5).map((module) => (
            <Button
              key={module.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate(module.route)}
            >
              <module.icon className="h-4 w-4 mr-2" />
              {module.name}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
