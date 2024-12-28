import { useState, useCallback } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { WorkflowPhase, TestResults } from '../types/test-results';

interface WorkflowState {
  activePhase: WorkflowPhase;
  isAnalyzing: boolean;
  progress: number;
  testStatus: 'pending' | 'warning' | 'success';
  validationErrors: string[];
  iterationCount: number;
  testHistory: TestResults[];
  currentTestResults: TestResults;
  readyForProduction: boolean;
  appliedCorrections: string[];
  lastPrediction: TestResults | null;
  creatives: Array<{ url: string; type: string }>;
  content: Array<{ text: string; type: string }>;
  messageToTest?: string;
}

export const useWorkflowState = (initialMessage?: string) => {
  const [state, setState] = useState<WorkflowState>({
    activePhase: 'prediction',
    isAnalyzing: false,
    progress: 0,
    testStatus: 'pending',
    validationErrors: [],
    iterationCount: 0,
    testHistory: [],
    currentTestResults: {
      engagement: 0,
      clickRate: 0,
      conversionRate: 0,
      cpa: 0,
      roi: 0,
      recommendations: [],
      risks: [],
      opportunities: []
    },
    readyForProduction: false,
    appliedCorrections: [],
    lastPrediction: null,
    creatives: [],
    content: [],
    messageToTest: initialMessage
  });

  const setMessageToTest = useCallback((message: string) => {
    setState(prev => ({ ...prev, messageToTest: message }));
  }, []);

  const handlePrediction = async () => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const { data: campaignData, error } = await supabase.functions.invoke('campaign-analyzer', {
        body: { 
          message: state.messageToTest,
          iterationCount: state.iterationCount 
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        currentTestResults: campaignData,
        creatives: campaignData.campaignDetails?.creatives || [],
        content: campaignData.content || [],
        lastPrediction: campaignData
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isAnalyzing: false }));
      throw error;
    }
  };

  const handleTest = async () => {
    // Implementation for handling test
  };

  const handleCorrection = () => {
    // Implementation for handling correction
  };

  const handleProduction = () => {
    // Implementation for handling production
  };

  return {
    state,
    actions: {
      setActivePhase: (phase: WorkflowPhase) => setState(prev => ({ ...prev, activePhase: phase })),
      handlePrediction,
      handleTest,
      handleCorrection,
      handleProduction,
      setMessageToTest
    }
  };
};
