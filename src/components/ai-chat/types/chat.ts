export interface Message {
  role: 'user' | 'assistant';
  content: string | StructuredContent;
}

export interface MetricsData {
  engagement: number;
  clicks: number;
  conversions: number;
  roi: number;
}

export interface StructuredContent {
  type: 'campaign_response';
  text: string;
  platform: string;
  targetAudience: string;
  location: string;
  propertyType: string;
  metadata: {
    type: string;
    platform: string;
    targetAudience: string;
    location: string;
    propertyType: string;
    metrics: MetricsData;
  };
}