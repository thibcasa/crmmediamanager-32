import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Edit2, Image, MessageSquare, PieChart, Settings, Share2, Workflow } from "lucide-react";
import { useNavigate } from "react-router-dom";

const modules = [
  { id: 'subject', name: 'Module Sujet', icon: MessageSquare, route: '/modules/subject' },
  { id: 'title', name: 'Module Titre', icon: Edit2, route: '/modules/title' },
  { id: 'content', name: 'Module Rédaction', icon: Edit2, route: '/modules/content' },
  { id: 'creative', name: 'Module Créatif', icon: Image, route: '/modules/creative' },
  { id: 'workflow', name: 'Module Workflow', icon: Workflow, route: '/modules/workflow' },
  { id: 'pipeline', name: 'Module Pipeline', icon: Share2, route: '/modules/pipeline' },
  { id: 'analysis', name: 'Module Analyse', icon: PieChart, route: '/modules/analysis' },
  { id: 'correction', name: 'Module Correction', icon: Settings, route: '/modules/correction' },
];

export const ModuleNavigation = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Navigation Modules</h2>
      </div>

      <div className="grid gap-3">
        {modules.map((module) => (
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
    </Card>
  );
};