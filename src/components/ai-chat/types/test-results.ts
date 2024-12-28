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