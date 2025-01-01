import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Edit2, Image, MessageSquare, PieChart, Settings, Share2, Workflow, Users, Mail, Share, FileText, Heading, CheckCircle2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModuleStates } from "@/hooks/useModuleStates";

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
    description: 'Étape 1: Définir le sujet principal',
    triggers: [] // First step has no triggers
  },
  { 
    id: 'title', 
    name: 'Module Titre', 
    icon: Heading, 
    route: '/modules/title',
    description: 'Étape 2: Générer des titres optimisés',
    triggers: ['subject'] // Triggered after subject
  },
  { 
    id: 'content', 
    name: 'Module Rédaction', 
    icon: FileText, 
    route: '/modules/content',
    description: 'Étape 3: Créer le contenu complet',
    triggers: ['title'] // Triggered after title
  },
  { 
    id: 'creative', 
    name: 'Module Créatif', 
    icon: Image, 
    route: '/modules/creative',
    description: 'Étape 4: Générer les visuels',
    triggers: ['content'] // Triggered after content
  },
  { 
    id: 'workflow', 
    name: 'Module Workflow', 
    icon: Workflow, 
    route: '/modules/workflow',
    description: 'Étape 5: Suivre le workflow',
    triggers: ['creative'] // Triggered after creative
  },
  { 
    id: 'pipeline', 
    name: 'Module Pipeline', 
    icon: Share2, 
    route: '/modules/pipeline',
    description: 'Étape 6: Gérer la publication',
    triggers: ['workflow'] // Triggered after workflow
  },
  { id: 'analysis', name: 'Module Analyse', icon: PieChart, route: '/modules/analysis' },
  { id: 'settings', name: 'Configuration API', icon: Settings, route: '/settings/api' },
];

export const ModuleNavigation = () => {
  const navigate = useNavigate();
  const { moduleStates } = useModuleStates();

  const getModuleStatus = (moduleId: string) => {
    const state = moduleStates[moduleId];
    if (!state) return 'pending';
    return state.status;
  };

  const getStatusIcon = (moduleId: string) => {
    const status = getModuleStatus(moduleId);
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const isModuleEnabled = (module: any) => {
    // First module is always enabled
    if (!module.triggers || module.triggers.length === 0) return true;
    
    // Check if all required previous modules are completed
    return module.triggers.every(triggerId => 
      getModuleStatus(triggerId) === 'completed'
    );
  };

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
          {modules.slice(3, 9).map((module) => {
            const isEnabled = isModuleEnabled(module);
            return (
              <Button
                key={module.id}
                variant="outline"
                className="w-full justify-start relative group"
                onClick={() => navigate(module.route)}
                disabled={!isEnabled}
              >
                <module.icon className="h-4 w-4 mr-2" />
                <div className="flex-1">
                  <span>{module.name}</span>
                  <span className="text-xs text-muted-foreground block">
                    {module.description}
                  </span>
                </div>
                {getStatusIcon(module.id)}
              </Button>
            );
          })}
        </div>

        {/* Other modules */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Autres Modules</h3>
          {modules.filter((_, index) => index < 3 || index > 8).map((module) => (
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