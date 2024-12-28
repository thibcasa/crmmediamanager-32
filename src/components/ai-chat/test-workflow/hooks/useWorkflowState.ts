import { useState } from 'react';
import { WorkflowState, TestResults } from '../types/test-results';
import { useWorkflowActions } from './useWorkflowActions';
import { toast } from '@/components/ui/use-toast';

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
  const [state, setState] = useState<WorkflowState>({
    activePhase: 'prediction',
    isAnalyzing: false,
    progress: 0,
    testStatus: 'pending',
    validationErrors: [
      "Optimisez le ton pour le marché immobilier premium",
      "Ajoutez plus de mots-clés spécifiques aux Alpes-Maritimes",
      "Renforcez l'appel à l'action"
    ],
    iterationCount: 0,
    testHistory: [],
    currentTestResults: initialTestResults,
    readyForProduction: false
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

  const actions = useWorkflowActions(setState, state, messageToTest, checkProductionReadiness);

  return {
    state,
    actions
  };
};