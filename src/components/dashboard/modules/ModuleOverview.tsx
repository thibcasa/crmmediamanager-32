import { Card } from "@/components/ui/card";
import { Brain, Edit2, Image, MessageSquare, PieChart, Settings, Share2, Workflow } from "lucide-react";

const modules = [
  { id: 'subject', name: 'Sujet', icon: MessageSquare, status: 'active' },
  { id: 'title', name: 'Titre', icon: Edit2, status: 'pending' },
  { id: 'content', name: 'Rédaction', icon: Edit2, status: 'pending' },
  { id: 'creative', name: 'Créatif', icon: Image, status: 'pending' },
  { id: 'workflow', name: 'Workflow', icon: Workflow, status: 'pending' },
  { id: 'pipeline', name: 'Pipeline', icon: Share2, status: 'pending' },
  { id: 'analysis', name: 'Analyse', icon: PieChart, status: 'pending' },
  { id: 'correction', name: 'Correction', icon: Settings, status: 'pending' },
];

export const ModuleOverview = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">État des Modules</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="flex items-center gap-2 p-3 bg-muted rounded-lg"
          >
            <module.icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{module.name}</span>
            <span className={`ml-auto text-xs ${
              module.status === 'active' ? 'text-green-500' : 'text-yellow-500'
            }`}>
              {module.status === 'active' ? 'Actif' : 'En attente'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};