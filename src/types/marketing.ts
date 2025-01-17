export interface DialogueFlow {
  role: 'assistant' | 'user';
  content: string;
  strategy?: MarketingStrategy;
}

export interface MarketingStrategy {
  objective: BusinessObjective;
  approach: MarketingApproach;
  actionPlan: ActionPlan;
  expectedResults: ExpectedResults;
}

export interface BusinessObjective {
  target: number;
  timeline: string;
  type: 'mandate_generation' | 'lead_generation' | 'brand_awareness';
}

export interface MarketingApproach {
  channels: string[];
  targetAudience: string;
  keyMessages: string[];
  contentStrategy: ContentStrategy;
}

export interface ActionPlan {
  steps: ActionStep[];
  timeline: Timeline;
  resources: Resources;
}

export interface ActionStep {
  type: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ExpectedResults {
  mandates: number;
  leads: number;
  engagement: number;
  roi: number;
}

export interface ContentStrategy {
  postTypes: string[];
  frequency: string;
  themes: string[];
  tone: string;
}

export interface Timeline {
  start: string;
  end: string;
  milestones: Milestone[];
}

export interface Milestone {
  date: string;
  description: string;
  target: number;
}

export interface Resources {
  budget: number;
  platforms: string[];
  team: string[];
}

export interface Campaign {
  id: string;
  objective: BusinessObjective;
  platform: string;
  content: CampaignContent[];
  schedule: CampaignSchedule;
  status: 'draft' | 'active' | 'paused' | 'completed';
  metrics?: {
    engagement: number;
    conversion: number;
    roi: number;
  };
}

export interface CampaignContent {
  type: 'post' | 'story' | 'reel';
  content: string;
  media?: string[];
}

export interface CampaignSchedule {
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'custom';
  customSchedule?: {
    days: string[];
    times: string[];
  };
}
