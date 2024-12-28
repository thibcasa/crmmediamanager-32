import { TestResults } from './test-results';

export type WorkflowPhase = 'prediction' | 'correction' | 'test' | 'production';
export type TestStatus = 'pending' | 'warning' | 'success';

export interface WorkflowState {
  activePhase: WorkflowPhase;
  isAnalyzing: boolean;
  progress: number;
  testStatus: TestStatus;
  validationErrors: string[];
  iterationCount: number;
  testHistory: TestResults[];
  currentTestResults: TestResults;
}

export interface WorkflowActions {
  handleTest: () => Promise<void>;
  handleCorrection: () => void;
  handleProduction: () => void;
  setActivePhase: (phase: WorkflowPhase) => void;
}