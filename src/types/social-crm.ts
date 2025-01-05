export type PostMetrics = {
  engagement_rate: number;
  clicks: number;
  impressions: number;
  leads_generated: number;
  sentiment_score: number;
};

export type PostObjective = {
  metric: keyof PostMetrics;
  target: number;
  current: number;
};

export type PostOptimization = {
  original_content: string;
  optimized_content: string;
  optimization_type: 'sentiment' | 'engagement' | 'conversion';
  applied_at: string;
  performance_delta?: number;
};

export type SocialPost = {
  id: string;
  content: string;
  platform: 'linkedin' | 'facebook' | 'instagram';
  scheduled_for: string;
  published_at?: string;
  metrics?: PostMetrics;
  optimizations?: PostOptimization[];
  status: 'draft' | 'scheduled' | 'published' | 'optimizing';
};