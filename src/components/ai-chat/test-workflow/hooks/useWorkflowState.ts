import { useState } from 'react';
import { WorkflowState } from '../types/workflow-types';
import { TestResults } from '../types/test-results';
import { useWorkflowActions } from './useWorkflowActions';
import { useToast } from '@/hooks/use-toast';

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

  const actions = useWorkflowActions(setState, state, messageToTest);

  return { state, actions };
};