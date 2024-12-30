export interface MetricsData {
  engagement?: number;
  clicks?: number;
  conversions?: number;
  roi?: number;
}

export interface StructuredMessage {
  type: string;
  text: string;
  platform: string;
  targetAudience: string;
  metadata?: {
    type: string;
    platform: string;
    targetAudience: string;
    metrics?: MetricsData;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | StructuredMessage;
  metadata?: {
    type: string;
    platform: string;
    targetAudience: string;
    metrics?: MetricsData;
  };
}