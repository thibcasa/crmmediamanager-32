export interface MetricsData {
  engagement: number;
  clicks: number;
  conversions: number;
  roi: number;
}

export interface StructuredContent {
  text?: string;
  platform?: string;
  targetAudience?: string;
  location?: string;
  propertyType?: string;
  metadata?: {
    metrics?: MetricsData;
    type?: string;
    platform?: string;
    targetAudience?: string;
    location?: string;
    propertyType?: string;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | StructuredContent;
}