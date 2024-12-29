import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAIOrchestrator = () => {
  const { executeWorkflow: executeBaseWorkflow, isProcessing } = useWorkflowExecution();
  const { toast } = useToast();
  const [currentObjective, setCurrentObjective] = useState<string | null>(null);

  const executeWorkflow = async (objective: string) => {
    try {
      setCurrentObjective(objective);
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);
      
      const result = await executeBaseWorkflow(objective);
      
      console.log('Résultat de l\'orchestration:', result);
      
      toast({
        title: "Workflow exécuté avec succès",
        description: `Campagne créée avec le persona "${result.selectedPersona.name}"`,
      });

      return result;
    } catch (error) {
      console.error('Erreur dans l\'orchestration:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution du workflow",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    executeWorkflow,
    isProcessing,
    currentObjective
  };
};