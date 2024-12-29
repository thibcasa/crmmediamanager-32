import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SocialCampaign } from "@/types/social";
import { supabase } from '@/lib/supabaseClient';
import { Brain, TrendingUp, Users, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CampaignAnalysisPageProps {
  campaign: SocialCampaign;
  onClose: () => void;
}

export const CampaignAnalysisPage = ({ campaign, onClose }: CampaignAnalysisPageProps) => {
  const { toast } = useToast();
  const [optimizationInProgress, setOptimizationInProgress] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  useEffect(() => {
    fetchAnalysisData();
  }, [campaign.id]);

  const fetchAnalysisData = async () => {
    try {
      const { data: analytics, error } = await supabase
        .from('social_interactions')
        .select('*')
        .eq('user_id', campaign.user_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setAnalysisData(analytics);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'analyse",
        variant: "destructive"
      });
    }
  };

  const handleAIOptimization = async () => {
    setOptimizationInProgress(true);
    try {
      const { data, error } = await supabase.functions.invoke('campaign-analyzer', {
        body: { campaignId: campaign.id }
      });

      if (error) throw error;

      toast({
        title: "Optimisation réussie",
        description: "Les paramètres de ciblage ont été mis à jour"
      });

      // Refresh analysis data
      fetchAnalysisData();
    } catch (error) {
      console.error('Error during AI optimization:', error);
      toast({
        title: "Erreur",
        description: "L'optimisation a échoué",
        variant: "destructive"
      });
    } finally {
      setOptimizationInProgress(false);
    }
  };

  const mockPerformanceData = [
    { date: '2024-01', predicted: 65, actual: 70 },
    { date: '2024-02', predicted: 75, actual: 72 },
    { date: '2024-03', predicted: 85, actual: 88 },
    { date: '2024-04', predicted: 90, actual: 85 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{campaign.name}</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour
        </button>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <Brain className="w-4 h-4 mr-2" />
            Prédictions & IA
          </TabsTrigger>
          <TabsTrigger value="targeting">
            <Users className="w-4 h-4 mr-2" />
            Ciblage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Performance par réseau social</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#8884d8" 
                    name="Prédiction"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#82ca9d" 
                    name="Réel"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Optimisation IA</h3>
              <button
                onClick={handleAIOptimization}
                disabled={optimizationInProgress}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {optimizationInProgress ? (
                  <Brain className="w-4 h-4 animate-pulse" />
                ) : (
                  "Optimiser avec l'IA"
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">Engagement prévu</h4>
                <p className="text-2xl font-bold">4.5%</p>
                <p className="text-sm text-muted-foreground">+0.8% vs actuel</p>
              </Card>

              <Card className="p-4">
                <h4 className="text-sm font-medium mb-2">ROI projeté</h4>
                <p className="text-2xl font-bold">2.8x</p>
                <p className="text-sm text-muted-foreground">+0.3x vs actuel</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="targeting">
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Persona</h4>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{campaign.targeting_criteria?.persona || 'Non défini'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Localisation</h4>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{campaign.targeting_criteria?.location || 'Non défini'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Recommandations IA</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>Élargir la tranche d'âge de 5 ans</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span>Ajouter les villes voisines</span>
                </li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};