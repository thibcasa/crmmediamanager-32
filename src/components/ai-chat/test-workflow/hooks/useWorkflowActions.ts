import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { TestResults, WorkflowPhase } from '../types/test-results';
import { calculateImprovement, checkProductionReadiness } from '../utils/metrics-utils';

export const useWorkflowActions = (
  setState: React.Dispatch<React.SetStateAction<any>>,
  state: any,
  messageToTest?: string
) => {
  const { toast } = useToast();

  const handlePrediction = async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const { data } = await supabase.functions.invoke('campaign-analyzer', {
        body: { 
          message: messageToTest,
          appliedCorrections: state.appliedCorrections,
          iterationCount: state.iterationCount 
        }
      });

      setState(prev => ({
        ...prev,
        lastPrediction: data,
        activePhase: 'test',
        isAnalyzing: false
      }));

      toast({
        title: "Nouvelle prédiction générée",
        description: "Passez à la phase de test pour valider les résultats."
      });
    } catch (error) {
      console.error('Error in prediction:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la prédiction",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleTest = async () => {
    if (!state.lastPrediction) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer une prédiction",
        variant: "destructive"
      });
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true,
      testStatus: 'pending'
    }));

    try {
      const results = {
        ...state.lastPrediction,
        iterationMetrics: {
          improvementRate: calculateImprovement(
            state.lastPrediction,
            state.currentTestResults
          ),
          previousResults: state.currentTestResults,
          iterationCount: state.iterationCount + 1
        }
      };

      const isReadyForProduction = checkProductionReadiness(results);

      setState(prev => ({
        ...prev,
        currentTestResults: results,
        testHistory: [...prev.testHistory, results],
        iterationCount: prev.iterationCount + 1,
        testStatus: 'success',
        readyForProduction: isReadyForProduction,
        activePhase: 'correction',
        isAnalyzing: false,
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
    } catch (error) {
      console.error('Error in test:', error);
      setState(prev => ({ 
        ...prev, 
        testStatus: 'warning',
        isAnalyzing: false 
      }));
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant le test",
        variant: "destructive"
      });
    }
  };

  const handleCorrection = (corrections: string[]) => {
    setState(prev => ({ 
      ...prev, 
      appliedCorrections: [...prev.appliedCorrections, ...corrections],
      activePhase: 'prediction'
    }));
    
    toast({
      title: `${corrections.length} corrections appliquées`,
      description: "Générez une nouvelle prédiction pour voir l'impact des corrections.",
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

  return {
    handlePrediction,
    handleTest,
    handleCorrection,
    handleProduction,
    setActivePhase: (phase: WorkflowPhase) => setState(prev => ({ ...prev, activePhase: phase }))
  };
};