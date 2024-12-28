import { useState } from "react";
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
  PlayCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabaseClient";

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
    try {
      // 1. Analyse LinkedIn pour détecter les propriétaires
      const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'analyze_profiles', location: 'Alpes-Maritimes' }
      });
      
      if (linkedinError) throw linkedinError;

      // 2. Générer du contenu test avec l'IA
      const { data: contentData, error: contentError } = await supabase.functions.invoke('content-generator', {
        body: { 
          type: 'social',
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes"
        }
      });

      if (contentError) throw contentError;

      // 3. Analyser les performances prédictives
      const { data: predictiveData, error: predictiveError } = await supabase.functions.invoke('predictive-analysis', {
        body: { 
          content: contentData.content,
          marketContext: {
            region: "Alpes-Maritimes",
            propertyType: "all",
            marketTrends: "rising"
          }
        }
      });

      if (predictiveError) throw predictiveError;

      // 4. Créer une campagne test
      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Test Campagne ${new Date().toLocaleDateString()}`,
          platform: 'linkedin',
          status: 'draft',
          targeting_criteria: {
            location: "Alpes-Maritimes",
            propertyOwners: true,
            ageRange: "35-65"
          },
          message_template: contentData.content
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      return {
        socialMediaAnalysis: [
          `${linkedinData.potentialLeads} propriétaires détectés sur LinkedIn dans les Alpes-Maritimes`,
          `${linkedinData.activeDiscussions} conversations pertinentes identifiées`,
          `Zones à fort potentiel : ${linkedinData.hotspots.join(', ')}`
        ],
        contentAnalysis: [
          `Message type optimal : ${contentData.bestPerforming}`,
          `Meilleurs créneaux : ${contentData.bestTiming}`,
          `Score d'engagement prévu : ${predictiveData.engagement.rate * 100}%`
        ],
        campaignPredictions: [
          `ROI estimé : ${predictiveData.roi.predicted * 100}%`,
          `Coût par lead estimé : ${predictiveData.costPerLead}€`,
          `Leads potentiels : ${predictiveData.projectedLeads} sur 30 jours`
        ]
      };
    } catch (error) {
      console.error('Erreur dans l\'analyse:', error);
      throw error;
    }
  };

  const handleSimulation = async () => {
    try {
      setIsSimulating(true);
      toast({
        title: "Simulation complète lancée",
        description: "Analyse du marché, génération de contenu et prédictions en cours...",
      });

      const results = await runMarketAnalysis();
      setSimulationResults([
        ...results.socialMediaAnalysis,
        ...results.contentAnalysis,
        ...results.campaignPredictions
      ]);

      toast({
        title: "Simulation terminée",
        description: "Toutes les analyses ont été complétées avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
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
                {isSimulating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Lancer la simulation complète
                  </>
                )}
              </Button>
            </div>

            {/* Affichage des résultats de simulation */}
            {simulationResults.length > 0 && (
              <div className="px-2">
                <Alert>
                  <AlertTitle>Résultats de la simulation complète</AlertTitle>
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
