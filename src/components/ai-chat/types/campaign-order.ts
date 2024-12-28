export interface CampaignPost {
  content: string;
  trigger_conditions: {
    metric: string;
    operator: string;
    value: number;
  }[];
  status: 'draft' | 'scheduled' | 'published';
  performance_metrics?: {
    engagement: number;
    leads: number;
    roi: number;
  };
}

export interface CampaignOrder {
  objective: string;
  target_audience: string;
  success_metrics: {
    min_leads: number;
    target_roi: number;
    min_engagement: number;
  };
  posts: CampaignPost[];
  workflow_config: {
    frequency: string;
    max_posts_per_day: number;
    optimal_posting_times: string[];
  };
}