import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Users, Building2, MessageSquare, BarChart3, GitBranch, Calendar, Workflow, Network, Megaphone } from "lucide-react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Users, label: "Prospects", path: "/prospects" },
  { icon: GitBranch, label: "Pipeline", path: "/pipeline" },
  { icon: Building2, label: "Propriétés", path: "/properties" },
  { icon: MessageSquare, label: "Chat IA", path: "/ai-chat" },
  { icon: Megaphone, label: "Campagnes", path: "/campaigns" },
  { icon: Calendar, label: "Calendrier", path: "/calendar" },
  { icon: Workflow, label: "Workflow", path: "/workflow" },
  { icon: Network, label: "API", path: "/api-settings" },
  { icon: BarChart3, label: "Analyses", path: "/analytics" },
];

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-sage-500" />
              <span className="font-semibold text-lg">ImmoAI</span>
            </div>
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-sage-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-sage-500" />
                  {item.label}
                </a>
              ))}
            </nav>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 animate-fadeIn">
            <SidebarTrigger />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}