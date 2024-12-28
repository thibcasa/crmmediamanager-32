import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Home, 
  Users, 
  Building2, 
  MessageSquare, 
  BarChart3, 
  GitBranch, 
  Calendar, 
  Workflow, 
  Network, 
  Megaphone, 
  TrendingUp,
  PlayCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  { icon: TrendingUp, label: "Analytics", path: "/analytics" },
];

export function AppLayout() {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<string[]>([]);

  const runMarketAnalysis = async () => {
    // Simuler une analyse complète du marché immobilier
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      socialMediaAnalysis: [
        "Détection de 127 propriétaires potentiels dans les Alpes-Maritimes via LinkedIn",
        "15 conversations actives détectées sur Facebook concernant la vente immobilière",
        "3 zones à fort potentiel identifiées : Antibes, Cannes, Nice"
      ],
      contentAnalysis: [
        "Message type le plus efficace : 'Estimation gratuite de votre bien'",
        "Meilleur moment pour poster : Mardi et Jeudi 18h-20h",
        "Taux d'engagement moyen prévu : 4.2%"
      ],
      campaignPredictions: [
        "ROI estimé de la campagne : 320%",
        "Coût par lead estimé : 45€",
        "Temps moyen de conversion : 45 jours"
      ]
    };
  };

  const handleSimulation = async () => {
    try {
      setIsSimulating(true);
      toast({
        title: "Simulation lancée",
        description: "Analyse complète du marché immobilier en cours...",
      });

      // Lancer l'analyse de marché
      const results = await runMarketAnalysis();
      setSimulationResults([
        ...results.socialMediaAnalysis,
        ...results.contentAnalysis,
        ...results.campaignPredictions
      ]);

      toast({
        title: "Simulation terminée",
        description: "L'analyse prédictive est disponible",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la simulation",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border/50">
          <SidebarContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-sage-500" />
              <span className="font-semibold text-lg">ImmoAI</span>
            </div>
            
            {/* Bouton de simulation proéminent */}
            <div className="px-2">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white flex items-center gap-2 h-12"
                onClick={handleSimulation}
                disabled={isSimulating}
              >
                <PlayCircle className="w-5 h-5" />
                {isSimulating ? 'Analyse en cours...' : 'Lancer l\'analyse prédictive'}
              </Button>
            </div>

            {/* Affichage des résultats de simulation */}
            {simulationResults.length > 0 && (
              <div className="px-2">
                <Alert>
                  <AlertTitle>Résultats de l'analyse prédictive</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      {simulationResults.map((result, index) => (
                        <li key={index}>{result}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}

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