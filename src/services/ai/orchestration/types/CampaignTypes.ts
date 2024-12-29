export interface PlatformStrategy {
  contentType: string;
  format: string;
  frequency: string;
  bestTimes: string[];
  approach: string;
}

export interface CampaignResult {
  id: string;
  name: string;
  platform: string;
  status: string;
  persona_id: string;
  targeting_criteria: any;
  content_strategy: any;
  target_metrics: any;
}

export interface AutomationConfig {
  campaignId: string;
  objective: string;
  strategy: {
    targetMetrics: {
      daily_meetings: number;
      engagement_rate: number;
      conversion_rate: number;
    };
  };
}