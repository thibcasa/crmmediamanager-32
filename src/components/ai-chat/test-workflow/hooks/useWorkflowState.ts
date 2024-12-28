import { useState } from 'react';
import { WorkflowState, TestResults } from '../types/test-results';
import { useWorkflowActions } from './useWorkflowActions';

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
  }
};

export const useWorkflowState = (messageToTest?: string) => {
  const [state, setState] = useState<WorkflowState>({
    activePhase: 'prediction',
    isAnalyzing: false,
    progress: 0,
    testStatus: 'pending',
    validationErrors: [],
    iterationCount: 0,
    testHistory: [],
    currentTestResults: initialTestResults
  });

  const actions = useWorkflowActions(setState, state, messageToTest);

  return {
    state,
    actions
  };
};