import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  LayoutDashboard,
  ListFilter,
  PlusCircle,
  History,
  BarChart,
  Settings,
  HelpCircle,
  MessageSquare,
  Brain,
  Target,
  Pencil,
  Image,
  Workflow,
  Pipeline,
  LineChart,
  Wrench,
  FileText,
  Users,
  AlertCircle
} from "lucide-react";

const menuItems = [
  {
    label: "Pages Principales",
    items: [
      { icon: LayoutDashboard, label: "Tableau de Bord", path: "/dashboard" },
    ]
  },
  {
    label: "Campagnes",
    items: [
      { icon: ListFilter, label: "Liste des Campagnes", path: "/campaigns" },
      { icon: PlusCircle, label: "Nouvelle Campagne", path: "/campaigns/new" },
      { icon: History, label: "Historique", path: "/campaigns/history" },
    ]
  },
  {
    label: "Modules",
    items: [
      { icon: Brain, label: "Module Sujet", path: "/modules/subject" },
      { icon: Target, label: "Module Titre", path: "/modules/title" },
      { icon: Pencil, label: "Module Rédaction", path: "/modules/content" },
      { icon: Image, label: "Module Créatif", path: "/modules/creative" },
      { icon: Workflow, label: "Module Workflow", path: "/modules/workflow" },
      { icon: Pipeline, label: "Module Pipeline", path: "/modules/pipeline" },
      { icon: LineChart, label: "Analyse Prédictive", path: "/modules/predictive" },
      { icon: Wrench, label: "Module Correction", path: "/modules/correction" },
    ]
  },
  {
    label: "Rapports & Analyses",
    items: [
      { icon: BarChart, label: "Rapports", path: "/reports" },
      { icon: FileText, label: "Performance", path: "/performance" },
    ]
  },
  {
    label: "Administration",
    items: [
      { icon: Settings, label: "Configuration", path: "/settings" },
      { icon: Users, label: "Utilisateurs", path: "/users" },
      { icon: AlertCircle, label: "Logs & Monitoring", path: "/monitoring" },
    ]
  },
  {
    label: "Support",
    items: [
      { icon: HelpCircle, label: "Documentation", path: "/docs" },
      { icon: MessageSquare, label: "Assistance", path: "/support" },
    ]
  },
];

export function AppLayout() {
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
                    <a
                      key={item.path}
                      href={item.path}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </a>
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