import { useWorkflowExecution } from './hooks/useWorkflowExecution';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ModuleState, ModuleType, CampaignObjective, GoalType } from '@/types/modules';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Brain, CheckCircle, AlertCircle, Loader2, Target } from "lucide-react";
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
    customMetrics?: { [key: string]: number };
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

    // Detect lead generation objectives
    if (objective.toLowerCase().includes('lead')) {
      return { goalType: 'lead_generation' };
    }

    // Detect brand awareness objectives
    if (objective.toLowerCase().includes('notoriété') || objective.toLowerCase().includes('visibilité')) {
      return { goalType: 'brand_awareness' };
    }

    // Detect sales objectives
    if (objective.toLowerCase().includes('vente') || objective.toLowerCase().includes('vendre')) {
      return { goalType: 'sales' };
    }

    // Default to custom goal type for any other objective
    return { 
      goalType: 'custom',
      customMetrics: {
        engagement: 0.1,
        conversion: 0.05,
        roi: 2
      }
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
      console.log('Démarrage de l\'orchestration avec l\'objectif:', objective);
      
      // Parse objective
      const parsedObjective = parseObjective(objective);
      if (parsedObjective.mandateGoal) {
        setMandateGoal(parsedObjective.mandateGoal);
        console.log(`Objectif détecté: ${parsedObjective.mandateGoal} mandats par ${parsedObjective.frequency}`);
      }

      // Convert string objective to CampaignObjective object
      const campaignObjective: CampaignObjective = {
        objective: objective,
        goalType: parsedObjective.goalType,
        platform: 'linkedin',
        mandateGoal: parsedObjective.mandateGoal,
        frequency: parsedObjective.frequency,
        customMetrics: parsedObjective.customMetrics
      };
      
      // Execute module chain with proper object
      const results = await ModuleOrchestrator.executeModuleChain(campaignObjective);
      
      // Update all module states
      Object.entries(results).forEach(([moduleType, result]) => {
        updateModuleState(moduleType as ModuleType, {
          status: 'validated',
          data: result.data,
          predictions: result.predictions,
          validationScore: result.validationScore || 0
        });
      });

      // Create campaign in database
      const { data: campaign, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${parsedObjective.goalType} - ${objective}`,
          platform: 'linkedin',
          status: 'active',
          targeting_criteria: {
            location: "Alpes-Maritimes",
            interests: ["Immobilier", "Investissement immobilier"],
            property_types: ["Appartement", "Maison", "Villa"]
          },
          message_template: results.content.data?.template,
          target_metrics: {
            ...parsedObjective.customMetrics,
            weekly_mandates: parsedObjective.mandateGoal || 0,
            engagement_rate: 0.05,
            conversion_rate: 0.02
          }
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Log successful execution
      await supabase.from('automation_logs').insert({
        user_id: session.user.id,
        action_type: 'workflow_execution',
        description: `Workflow exécuté avec succès pour l'objectif: ${objective}`,
        metadata: {
          objective,
          results,
          campaign_id: campaign.id,
          goal_type: parsedObjective.goalType,
          custom_metrics: parsedObjective.customMetrics
        }
      });

      toast({
        title: "Workflow exécuté avec succès",
        description: `Campagne créée avec l'objectif: ${objective}`,
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
    getModuleIcon,
    mandateGoal,
    currentMandates
  };
};