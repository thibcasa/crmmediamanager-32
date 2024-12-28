export interface CampaignCreative {
  type: 'image' | 'video';
  url: string;
  format: string;
}

export interface CampaignContent {
  type: 'post' | 'story' | 'reel' | 'article';
  text: string;
}

export interface CampaignData {
  objective: string;
  creatives: CampaignCreative[];
  content: CampaignContent[];
  predictions: {
    engagement: number;
    costPerLead: number;
    roi: number;
    estimatedLeads: number;
  };
}