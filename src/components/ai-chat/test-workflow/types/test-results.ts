export type WorkflowPhase = 'prediction' | 'correction' | 'test' | 'production';
export type TestStatus = 'pending' | 'warning' | 'success';

export interface AudienceSegment {
  name: string;
  score: number;
  potential: number;
}

export interface Demographics {
  age: string[];
  location: string[];
  interests: string[];
}

export interface Creative {
  type: 'image' | 'video' | 'text';
  content: string;
  performance: number;
}

export interface CampaignContent {
  messages: string[];
  headlines: string[];
  callsToAction: string[];
}

export interface WorkflowStep {
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
  metrics?: Record<string, number>;
}

export interface PredictedMetrics {
  leadsPerWeek: number;
  costPerLead: number;
  totalBudget: number;
  revenueProjection: number;
}

export interface IterationMetrics {
  improvementRate: number;
  previousResults: TestResults | null;
  iterationCount: number;
}

export interface TestResults {
  engagement: number;
  clickRate: number;
  conversionRate: number;
  cpa: number;
  roi: number;
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  appliedCorrections?: string[]; // Nouvelles corrections appliquées
  audienceInsights?: {
    segments: AudienceSegment[];
    demographics: Demographics;
  };
  predictedMetrics?: PredictedMetrics;
  campaignDetails?: {
    creatives: Creative[];
    content: CampaignContent;
    workflow: {
      steps: WorkflowStep[];
    };
  };
  iterationMetrics?: IterationMetrics;
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
  readyForProduction: boolean;
}