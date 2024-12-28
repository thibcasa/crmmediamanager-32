import { TestResults, WorkflowPhase } from './test-results';

export interface WorkflowState {
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
}

export interface WorkflowActions {
  setActivePhase: (phase: WorkflowPhase) => void;
  handlePrediction: () => Promise<void>;
  handleTest: () => Promise<void>;
  handleCorrection: (corrections: string[]) => void;
  handleProduction: () => void;
}