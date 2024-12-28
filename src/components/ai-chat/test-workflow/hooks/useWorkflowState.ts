import { useState } from 'react';
import { WorkflowState, TestResults, WorkflowPhase } from '../types/test-results';
import { useWorkflowActions } from './useWorkflowActions';
import { useToast } from '@/components/ui/use-toast';

const initialTestResults: TestResults = {
  engagement: 0,
  clickRate: 0,
  conversionRate: 0,
  cpa: 0,
  roi: 0,
  recommendations: [],
  risks: [],
  opportunities: [],
  audienceInsights: {
    segments: [],
    demographics: {
      age: [],
      location: [],
      interests: []
    }
  },
  predictedMetrics: {
    leadsPerWeek: 0,
    costPerLead: 0,
    totalBudget: 0,
    revenueProjection: 0
  },
  campaignDetails: {
    creatives: [],
    content: {
      messages: [],
      headlines: [],
      callsToAction: []
    },
    workflow: {
      steps: []
    }
  },
  iterationMetrics: {
    improvementRate: 0,
    previousResults: null,
    iterationCount: 0
  }
};

export const useWorkflowState = (messageToTest?: string) => {
  const { toast } = useToast();
  const [state, setState] = useState<WorkflowState>({
    activePhase: 'prediction',
    isAnalyzing: false,
    progress: 0,
    testStatus: 'pending',
    validationErrors: [],
    iterationCount: 0,
    testHistory: [],
    currentTestResults: initialTestResults,
    readyForProduction: false,
    appliedCorrections: [],
    lastPrediction: null
  });

  const checkProductionReadiness = (results: TestResults) => {
    const isReady = results.roi >= 3 && results.engagement >= 0.3;
    if (isReady && !state.readyForProduction) {
      toast({
        title: "Campagne prête pour la production !",
        description: "Les métriques ont atteint les seuils requis pour le déploiement.",
      });
    }
    return isReady;
  };

  const moveToNextPhase = (currentPhase: WorkflowPhase) => {
    const phases: WorkflowPhase[] = ['prediction', 'test', 'correction'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    return phases[nextIndex];
  };

  const actions = {
    setActivePhase: (phase: WorkflowPhase) => {
      setState(prev => ({ ...prev, activePhase: phase }));
    },

    handlePrediction: async () => {
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
      }
    },

    handleTest: async () => {
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
    },

    handleCorrection: (corrections: string[]) => {
      setState(prev => ({ 
        ...prev, 
        appliedCorrections: [...prev.appliedCorrections, ...corrections],
        activePhase: 'prediction'
      }));
      
      toast({
        title: `${corrections.length} corrections appliquées`,
        description: "Générez une nouvelle prédiction pour voir l'impact des corrections.",
      });
    },

    handleProduction: () => {
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
    }
  };

  return { state, actions };
};

const calculateImprovement = (current: TestResults, previous: TestResults) => {
  if (!previous) return 0;
  const engagementImprovement = (current.engagement - previous.engagement) / previous.engagement;
  const roiImprovement = (current.roi - previous.roi) / previous.roi;
  return ((engagementImprovement + roiImprovement) / 2) * 100;
};