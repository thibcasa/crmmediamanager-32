import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { CampaignData } from '../../../types/campaign';

export const useTestExecution = (onTestComplete: (predictions: CampaignData['predictions']) => void) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTest = async (campaignData: CampaignData) => {
    if (campaignData.creatives.length === 0 || campaignData.content.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer des créatives et du contenu.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('campaign-analyzer', {
        body: {
          content: campaignData.content[0]?.text,
          creatives: campaignData.creatives,
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes"
        }
      });

      clearInterval(interval);
      setProgress(100);

      if (error) throw error;

      const predictions = {
        engagement: data.engagement,
        costPerLead: data.cpa,
        roi: data.roi,
        estimatedLeads: data.predictedMetrics.leadsPerWeek
      };

      onTestComplete(predictions);

      toast({
        title: "Test terminé",
        description: "L'analyse prédictive a été effectuée avec succès."
      });
    } catch (error) {
      console.error('Error testing campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser la campagne.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
      setProgress(0);
    }
  };

  return {
    isTesting,
    progress,
    runTest
  };
};