export interface TestResults {
  engagement: number;
  clickRate: number;
  conversionRate: number;
  cpa: number;
  roi: number;
  recommendations: string[];
  risks: string[];
  opportunities: string[];
}

export interface TestMetrics {
  before: TestResults;
  after?: TestResults;
}

export interface CampaignTest {
  id: string;
  createdAt: Date;
  metrics: TestMetrics;
  status: 'pending' | 'warning' | 'success';
}

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