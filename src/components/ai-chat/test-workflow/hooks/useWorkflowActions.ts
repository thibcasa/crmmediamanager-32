import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { TestResults, WorkflowPhase } from '../types/test-results';

export const useWorkflowActions = (
  setState: React.Dispatch<React.SetStateAction<any>>,
  state: any,
  messageToTest?: string,
  checkProductionReadiness?: (results: TestResults) => boolean
) => {
  const { toast } = useToast();

  const updateProgress = (phase: number) => {
    setState(prev => ({ ...prev, progress: phase * 25 }));
  };

  const calculateImprovement = (current: TestResults, previous: TestResults) => {
    if (!previous) return 0;
    const engagementImprovement = (current.engagement - previous.engagement) / previous.engagement;
    const roiImprovement = (current.roi - previous.roi) / previous.roi;
    return ((engagementImprovement + roiImprovement) / 2) * 100;
  };

  const handleTest = async () => {
    if (!messageToTest) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord envoyer un message dans le chat",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, validationErrors: [] }));
    console.log("Démarrage de l'analyse...");
    
    try {
      // Phase 1: Analyse du contenu
      updateProgress(1);
      console.log("Phase 1: Analyse du contenu en cours...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 2: Évaluation de l'engagement
      updateProgress(2);
      console.log("Phase 2: Évaluation de l'engagement en cours...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        'campaign-analyzer',
        {
          body: { 
            message: messageToTest,
            iterationCount: state.iterationCount,
            previousResults: state.testHistory[state.testHistory.length - 1]
          }
        }
      );

      if (analysisError) throw analysisError;

      // Phase 3: Calcul des métriques prédictives
      updateProgress(3);
      console.log("Phase 3: Calcul des métriques prédictives en cours...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      const iterationMultiplier = 1 + (state.iterationCount * 0.15);
      const results: TestResults = {
        ...analysisData,
        iterationMetrics: {
          improvementRate: calculateImprovement(
            analysisData,
            state.testHistory[state.testHistory.length - 1]
          ),
          previousResults: state.testHistory[state.testHistory.length - 1],
          iterationCount: state.iterationCount + 1
        }
      };

      // Phase 4: Finalisation
      updateProgress(4);
      console.log("Phase 4: Finalisation de l'analyse...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      const isReadyForProduction = checkProductionReadiness?.(results);

      setState(prev => ({
        ...prev,
        currentTestResults: results,
        testHistory: [...prev.testHistory, results],
        iterationCount: prev.iterationCount + 1,
        testStatus: 'success',
        readyForProduction: isReadyForProduction,
        activePhase: 'correction',
        validationErrors: [
          "Optimisez le ton pour le marché immobilier premium",
          "Ajoutez plus de références aux quartiers prisés",
          "Renforcez la proposition de valeur"
        ]
      }));

      if (results.iterationMetrics.improvementRate > 0) {
        toast({
          title: "Amélioration détectée !",
          description: `Performance améliorée de ${results.iterationMetrics.improvementRate.toFixed(1)}% par rapport au test précédent.`,
        });
      }

      updateProgress(100);
      return results;
    } catch (error) {
      console.error('Error in test workflow:', error);
      setState(prev => ({ ...prev, testStatus: 'warning' }));
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant l'analyse",
        variant: "destructive"
      });
    } finally {
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleCorrection = () => {
    setState(prev => ({ 
      ...prev, 
      activePhase: 'test',
      validationErrors: [
        "Optimisez davantage le ton pour le marché premium",
        "Ajoutez plus de références aux quartiers prisés",
        "Renforcez la proposition de valeur"
      ]
    }));
    toast({
      title: "Correction en cours",
      description: "Appliquez les recommandations puis relancez un test.",
    });
  };

  const handleProduction = () => {
    if (!state.readyForProduction) {
      toast({
        title: "Attention",
        description: "Les performances ne sont pas encore optimales. Continuez les itérations.",
        variant: "destructive"
      });
      return;
    }
    setState(prev => ({ ...prev, activePhase: 'production' }));
    toast({
      title: "Campagne prête !",
      description: "Votre campagne optimisée peut maintenant être déployée.",
    });
  };

  const setActivePhase = (phase: WorkflowPhase) => {
    setState(prev => ({ ...prev, activePhase: phase }));
  };

  return {
    handleTest,
    handleCorrection,
    handleProduction,
    setActivePhase
  };
};