export type CampaignContentType = 'post' | 'story' | 'reel' | 'article';

export interface CampaignCreative {
  type: 'image' | 'video';
  url: string;
  format: string;
}

export interface CampaignContent {
  type: CampaignContentType;
  text: string;
}

export interface CampaignData {
  objective: string;
  creatives: CampaignCreative[];
  content: CampaignContent[];
  predictions?: {
    engagement: number;
    costPerLead: number;
    roi: number;
    estimatedLeads: number;
  };
}