export type WorkflowPhase = 'prediction' | 'correction' | 'test' | 'production';
export type TestStatus = 'pending' | 'warning' | 'success';

export interface TestResults {
  engagement: number;
  clickRate: number;
  conversionRate: number;
  cpa: number;
  roi: number;
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  audienceInsights?: {
    segments: Array<{
      name: string;
      score: number;
      potential: number;
    }>;
    demographics: {
      age: string[];
      location: string[];
      interests: string[];
    };
  };
  predictedMetrics?: {
    leadsPerWeek: number;
    costPerLead: number;
    totalBudget: number;
    revenueProjection: number;
  };
  campaignDetails?: {
    creatives: Array<{
      type: 'image' | 'video' | 'text';
      content: string;
      performance: number;
    }>;
    content: {
      messages: string[];
      headlines: string[];
      callsToAction: string[];
    };
    workflow: {
      steps: Array<{
        name: string;
        status: string;
        metrics?: Record<string, number>;
      }>;
    };
  };
}

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

export interface TestMetrics {
  before: TestResults;
  after?: TestResults;
}

export interface CampaignTest {
  id: string;
  createdAt: Date;
  metrics: TestMetrics;
  status: TestStatus;
}