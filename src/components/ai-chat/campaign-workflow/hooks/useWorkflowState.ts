import { useState } from 'react';

interface TestResults {
  roi: number;
  engagement: number;
}

interface WorkflowState {
  activePhase: string;
  isAnalyzing: boolean;
  progress: number;
  currentTestResults: TestResults;
  testHistory: TestResults[];
  iterationCount: number;
  validationErrors: string[];
}

export const useWorkflowState = (initialObjective?: string) => {
  const [state, setState] = useState<WorkflowState>({
    activePhase: 'prediction',
    isAnalyzing: false,
    progress: 0,
    currentTestResults: { roi: 0, engagement: 0 },
    testHistory: [],
    iterationCount: 0,
    validationErrors: []
  });

  const actions = {
    setActivePhase: (phase: string) => {
      setState(prev => ({ ...prev, activePhase: phase }));
    },
    handleTest: async () => {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: true,
        iterationCount: prev.iterationCount + 1 
      }));
      // Simulation d'un test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false,
        currentTestResults: { roi: 2.5, engagement: 0.4 },
        testHistory: [...prev.testHistory, prev.currentTestResults]
      }));
    },
    handleCorrection: async () => {
      setState(prev => ({ ...prev, validationErrors: [] }));
    },
    handleProduction: async () => {
      console.log('Deploying to production');
    }
  };

  return { state, actions };
};