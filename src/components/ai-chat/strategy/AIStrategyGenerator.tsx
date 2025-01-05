import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAIStrategy } from './AIStrategyContext';
import { CampaignObjective } from '@/types/modules';

export const useAIStrategyGenerator = () => {
  const { toast } = useToast();
  const { setIsGeneratingStrategy } = useAIStrategy();
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  const generateStrategy = async (objective: CampaignObjective) => {
    try {
      setIsGeneratingStrategy(true);
      
      const { data: strategy, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: { 
          objective: objective.objective,
          goalType: objective.goalType,
          mandateGoal: objective.mandateGoal,
          frequency: objective.frequency
        }
      });

      if (error) throw error;

      setGeneratedStrategy(strategy);
      
      toast({
        title: "Stratégie générée",
        description: "La stratégie marketing a été générée avec succès",
      });

      return strategy;
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la stratégie marketing",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  return {
    generateStrategy,
    generatedStrategy
  };
};