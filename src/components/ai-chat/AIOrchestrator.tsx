import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ModuleState, ModuleType } from '@/types/modules';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ModuleOrchestrator } from '@/services/ai/orchestration/ModuleOrchestrator';

const initialModuleState: ModuleState = {
  status: 'idle',
  data: null,
  success: false,
  predictions: { engagement: 0, conversion: 0, roi: 0 },
  validationScore: 0
};

export const useAIOrchestrator = () => {
  const { executeWorkflow: executeBaseWorkflow, isProcessing } = useWorkflowExecution();
  const { toast } = useToast();
  const [currentObjective, setCurrentObjective] = useState<string | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<ModuleType, ModuleState>>({
    subject: { ...initialModuleState },
    title: { ...initialModuleState },
    content: { ...initialModuleState },
    creative: { ...initialModuleState },
    workflow: { ...initialModuleState },
    pipeline: { ...initialModuleState },
    predictive: { ...initialModuleState },
    analysis: { ...initialModuleState },
    correction: { ...initialModuleState }
  });

  const updateModuleState = (moduleType: ModuleType, newState: Partial<ModuleState>) => {
    setModuleStates(prev => ({
      ...prev,
      [moduleType]: {
        ...prev[moduleType],
        ...newState
      }
    }));
  };

  const executeWorkflow = async (objective: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour continuer",
          variant: "destructive",
        });
        return;
      }

      setCurrentObjective(objective);
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);
      
      // Execute module chain
      const results = await ModuleOrchestrator.executeModuleChain(objective);
      
      // Update all module states
      Object.entries(results).forEach(([moduleType, result]) => {
        updateModuleState(moduleType as ModuleType, {
          status: 'validated',
          data: result.data,
          predictions: result.predictions,
          validationScore: result.validationScore || 0
        });
      });

      // Log successful execution
      await supabase.from('automation_logs').insert({
        user_id: session.user.id,
        action_type: 'workflow_execution',
        description: `Workflow exécuté avec succès pour l'objectif: ${objective}`,
        metadata: {
          objective,
          results
        }
      });

      toast({
        title: "Workflow exécuté avec succès",
        description: "Tous les modules ont été exécutés avec succès",
      });

      return results;
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

  const getModuleIcon = (status: ModuleState['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  return {
    executeWorkflow,
    isProcessing,
    currentObjective,
    moduleStates,
    getModuleIcon
  };
};