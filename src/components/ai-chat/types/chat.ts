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
  platform: 'linkedin';
  targetAudience: 'property_owners';
  location: 'alpes_maritimes';
  propertyType: 'luxury';
  metadata: {
    type: 'campaign_response';
    platform: 'linkedin';
    targetAudience: 'property_owners';
    location: 'alpes_maritimes';
    propertyType: 'luxury';
    metrics: MetricsData;
  };
}