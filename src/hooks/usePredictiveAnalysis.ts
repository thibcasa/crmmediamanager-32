import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export interface PredictionResult {
  engagement: {
    rate: number;
    confidence: number;
    trends: any[];
  };
  conversion: {
    rate: number;
    projectedLeads: number;
    timeframe: string;
  };
  roi: {
    predicted: number;
    bestCase: number;
    worstCase: number;
  };
  marketTrends: {
    priceEvolution: number;
    demandIndex: number;
    seasonalityImpact: number;
  };
  recommendations: string[];
}

export const usePredictiveAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const analyzeCampaign = async (
    content: string,
    historicalData: any,
    marketContext: any
  ) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('predictive-analysis', {
        body: { content, historicalData, marketContext }
      });

      if (error) throw error;

      setPredictions(data.predictions);
      
      toast({
        title: "Analyse prédictive terminée",
        description: "Les prédictions ont été générées avec succès",
      });

      return data.predictions;
    } catch (error) {
      console.error('Error in predictive analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les prédictions",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    predictions,
    analyzeCampaign
  };
};