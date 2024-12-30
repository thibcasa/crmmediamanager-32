export interface Message {
  role: 'user' | 'assistant';
  content: string | StructuredContent;
}

export interface StructuredContent {
  type: 'structured';
  text: string;
  platform: 'linkedin';
  targetAudience: 'property_owners';
  metadata: {
    type: 'campaign_response';
    platform: 'linkedin';
    targetAudience: 'property_owners';
    location: 'alpes_maritimes';
    propertyType: 'luxury';
    metrics: {
      engagement: number;
      clicks: number;
      conversions: number;
      roi: number;
    };
  };
}