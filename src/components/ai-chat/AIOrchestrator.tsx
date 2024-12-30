import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ModuleState, ModuleType } from '@/types/modules';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export const useAIOrchestrator = () => {
  const { executeWorkflow: executeBaseWorkflow, isProcessing } = useWorkflowExecution();
  const { toast } = useToast();
  const [currentObjective, setCurrentObjective] = useState<string | null>(null);
  const [moduleStates, setModuleStates] = useState<Record<ModuleType, ModuleState>>({
    subject: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    title: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    content: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    creative: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    workflow: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    pipeline: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    predictive: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    analysis: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    correction: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 }
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
      setCurrentObjective(objective);
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);
      
      // Update module states during execution
      const handleModuleUpdate = (moduleType: ModuleType, status: ModuleState['status'], data?: any) => {
        updateModuleState(moduleType, { status, data });
      };
      
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