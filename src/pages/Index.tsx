import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Calendar,
  PieChart,
  Search,
  Mail,
  Linkedin,
  Workflow
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Prospects",
      description: "Gérer vos prospects et suivre leur progression",
      icon: Users,
      action: () => navigate("/prospects"),
      color: "bg-blue-500"
    },
    {
      title: "Chat AI",
      description: "Générer du contenu et analyser vos conversations",
      icon: MessageSquare,
      action: () => navigate("/ai-chat"),
      color: "bg-purple-500"
    },
    {
      title: "Calendrier",
      description: "Planifier et gérer vos rendez-vous",
      icon: Calendar,
      action: () => navigate("/calendar"),
      color: "bg-green-500"
    },
    {
      title: "Pipeline",
      description: "Suivre vos opportunités commerciales",
      icon: PieChart,
      action: () => navigate("/pipeline"),
      color: "bg-orange-500"
    },
    {
      title: "Recherche de Leads",
      description: "Trouver de nouveaux propriétaires",
      icon: Search,
      action: () => navigate("/lead-search"),
      color: "bg-red-500"
    },
    {
      title: "Campagnes Email",
      description: "Créer et gérer vos campagnes email",
      icon: Mail,
      action: () => navigate("/email-campaigns"),
      color: "bg-yellow-500"
    },
    {
      title: "LinkedIn",
      description: "Gérer vos campagnes LinkedIn",
      icon: Linkedin,
      action: () => navigate("/linkedin"),
      color: "bg-blue-600"
    },
    {
      title: "Automatisations",
      description: "Configurer vos workflows automatisés",
      icon: Workflow,
      action: () => navigate("/workflow"),
      color: "bg-indigo-500"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre activité immobilière efficacement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={module.action}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={module.action}
                  >
                    Accéder
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;