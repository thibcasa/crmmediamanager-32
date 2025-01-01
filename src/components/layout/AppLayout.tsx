import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  LayoutDashboard,
  Users,
  MessageSquare,
  Brain,
  Target,
  Pencil,
  Image,
  GitBranch,
  Workflow,
  LineChart,
  Wrench,
  Upload,
  Download,
  Settings,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Principal",
    items: [
      { icon: LayoutDashboard, label: "Tableau de Bord", path: "/dashboard" },
      { icon: Users, label: "Prospects", path: "/prospects" },
    ]
  },
  {
    label: "Modules IA",
    items: [
      { icon: Brain, label: "Module Sujet", path: "/modules/subject" },
      { icon: Target, label: "Module Titre", path: "/modules/title" },
      { icon: Pencil, label: "Module Rédaction", path: "/modules/content" },
      { icon: Image, label: "Module Créatif", path: "/modules/creative" },
      { icon: Workflow, label: "Module Workflow", path: "/modules/workflow" },
      { icon: GitBranch, label: "Module Pipeline", path: "/modules/pipeline" },
      { icon: LineChart, label: "Module Prédictif", path: "/modules/predictive" },
      { icon: Wrench, label: "Module Correction", path: "/modules/correction" },
    ]
  },
  {
    label: "Communication",
    items: [
      { icon: MessageSquare, label: "Chat IA", path: "/ai-chat" },
    ]
  },
  {
    label: "Support",
    items: [
      { icon: Settings, label: "Paramètres", path: "/settings" },
      { icon: HelpCircle, label: "Aide", path: "/help" },
    ]
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary" />
              <span className="font-semibold text-lg">ImmoAI CRM</span>
            </div>
            
            <nav className="space-y-6 px-2">
              {menuItems.map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="text-xs uppercase text-muted-foreground font-medium px-2">
                    {section.label}
                  </h4>
                  {section.items.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <SidebarTrigger />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}