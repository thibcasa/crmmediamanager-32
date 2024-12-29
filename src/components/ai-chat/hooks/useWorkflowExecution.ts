import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CampaignOrchestrator } from '@/services/ai/orchestration/CampaignOrchestrator';
import { WorkflowConfig } from '../types/workflow';

export const useWorkflowExecution = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const executeWorkflow = async (aiResponse: string, platform: string) => {
    setIsProcessing(true);
    try {
      console.log(`Démarrage de l'exécution du workflow pour ${platform}`);
      
      // Orchestration automatique de la campagne
      const result = await CampaignOrchestrator.orchestrateCampaign(aiResponse);

      // Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });

      toast({
        title: "Workflow exécuté avec succès",
        description: `Campagne créée avec le persona "${result.selectedPersona.name}"`,
      });

      return result;

    } catch (error) {
      console.error('Erreur dans l\'exécution du workflow:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution du workflow.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { executeWorkflow, isProcessing };
};