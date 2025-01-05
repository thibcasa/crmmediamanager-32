import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ModuleState, ModuleType, CampaignObjective, GoalType } from '@/types/modules';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { AIStrategyProvider } from './strategy/AIStrategyContext';
import { useAIStrategyGenerator } from './strategy/AIStrategyGenerator';
import { AIPerformanceMonitor } from './monitoring/AIPerformanceMonitor';

const initialModuleState: ModuleState = {
  status: 'idle',
  data: null,
  success: false,
  predictions: { engagement: 0, conversion: 0, roi: 0 },
  validationScore: 0
};

export const useAIOrchestrator = () => {
  const { executeWorkflow: executeBaseWorkflow, isProcessing } = useWorkflowExecution();
  const { generateStrategy } = useAIStrategyGenerator();
  const { toast } = useToast();
  const [currentObjective, setCurrentObjective] = useState<string | null>(null);
  const [mandateGoal, setMandateGoal] = useState<number>(0);
  const [currentMandates, setCurrentMandates] = useState<number>(0);
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

  const parseObjective = (objective: string): { 
    goalType: GoalType; 
    mandateGoal?: number;
    frequency?: 'daily' | 'weekly' | 'monthly';
  } => {
    const mandateMatch = objective.match(/(\d+)\s*mandats?/i);
    const weeklyMatch = objective.includes('semaine') || objective.includes('hebdomadaire');
    const monthlyMatch = objective.includes('mois') || objective.includes('mensuel');
    
    if (mandateMatch) {
      return {
        goalType: 'mandate_generation',
        mandateGoal: parseInt(mandateMatch[1]),
        frequency: weeklyMatch ? 'weekly' : monthlyMatch ? 'monthly' : 'daily'
      };
    }

    if (objective.toLowerCase().includes('lead')) {
      return { goalType: 'lead_generation' };
    }

    if (objective.toLowerCase().includes('notoriété') || objective.toLowerCase().includes('visibilité')) {
      return { goalType: 'brand_awareness' };
    }

    if (objective.toLowerCase().includes('vente') || objective.toLowerCase().includes('vendre')) {
      return { goalType: 'sales' };
    }

    return { 
      goalType: 'custom',
      frequency: 'daily'
    };
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
      
      const parsedObjective = parseObjective(objective);
      if (parsedObjective.mandateGoal) {
        setMandateGoal(parsedObjective.mandateGoal);
      }

      const campaignObjective: CampaignObjective = {
        objective: objective,
        goalType: parsedObjective.goalType,
        platform: 'linkedin',
        mandateGoal: parsedObjective.mandateGoal,
        frequency: parsedObjective.frequency
      };

      const strategy = await generateStrategy(campaignObjective);
      
      const results = await executeBaseWorkflow(strategy);
      
      Object.entries(results).forEach(([moduleType, result]) => {
        updateModuleState(moduleType as ModuleType, {
          status: 'validated',
          data: result.data,
          predictions: result.predictions,
          validationScore: result.validationScore || 0
        });
      });

      return results;
    } catch (error) {
      console.error('Error in orchestration:', error);
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
    getModuleIcon,
    mandateGoal,
    currentMandates
  };
};
