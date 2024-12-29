import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { SocialCampaign } from "@/types/social";
import { supabase } from '@/lib/supabaseClient';
import { Brain, TrendingUp, Users, MapPin } from 'lucide-react';
import { AdvancedKPIs } from '../analytics/AdvancedKPIs';
import { OptimizationSuggestions } from '../optimization/OptimizationSuggestions';

interface CampaignAnalysisPageProps {
  campaign: SocialCampaign;
  onClose: () => void;
}

export const CampaignAnalysisPage = ({ campaign, onClose }: CampaignAnalysisPageProps) => {
  const { toast } = useToast();
  const [optimizationInProgress, setOptimizationInProgress] = useState(false);

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
          <AdvancedKPIs campaignId={campaign.id} />
        </TabsContent>

        <TabsContent value="predictions">
          <OptimizationSuggestions campaignId={campaign.id} />
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};