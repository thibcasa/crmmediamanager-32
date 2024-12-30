export type SocialPlatform = "linkedin" | "twitter" | "facebook" | "instagram" | "tiktok" | "whatsapp";

export interface ModuleResult {
  success: boolean;
  data: any;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
  optimizations?: {
    suggestions: string[];
    priority: 'high' | 'medium' | 'low';
  };
}

export interface AIModule {
  execute: (input: any) => Promise<ModuleResult>;
  predict: (data: any) => Promise<{
    engagement: number;
    conversion: number;
    roi: number;
  }>;
  optimize: (result: ModuleResult) => Promise<ModuleResult>;
}

export interface BaseModuleResponse {
  success: boolean;
  data: any;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
}

export interface SocialCampaign {
  id: string;
  user_id?: string;
  platform: SocialPlatform;
  name: string;
  status?: string;
  schedule: {
    frequency?: string;
    times?: string[];
    days?: string[];
    customSchedule?: Record<string, any>;
  };
  targeting_criteria: {
    location?: string;
    interests?: string[];
    age_range?: string;
    job_titles?: string[];
    keywords?: string[];
    persona?: string;
  };
  message_template?: string;
  created_at?: string;
  updated_at?: string;
  ai_feedback?: {
    suggestions?: string[];
    performance_score?: number;
    next_actions?: string[];
  };
  posts: Array<{
    id: string;
    content: string;
    status: string;
    scheduled_at?: string;
    performance?: Record<string, number>;
  }>;
  post_triggers: Array<{
    type: string;
    condition: Record<string, any>;
    action: string;
  }>;
  target_metrics: {
    engagement_rate?: number;
    conversion_rate?: number;
    cost_per_lead?: number;
    roi?: number;
  };
  persona_id?: string;
  target_locations?: string[];
  content_strategy: {
    post_types: string[];
    posting_frequency: string;
    best_times: string[];
    content_themes: string[];
  };
  optimization_cycles: Array<{
    date: string;
    changes: Record<string, any>;
    results: Record<string, number>;
  }>;
  current_prediction: {
    success_probability?: number;
    estimated_roi?: number;
    potential_reach?: number;
  };
}

export interface ModuleInteraction {
  from: string;
  to: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'completed' | 'error';
}

export interface ModuleState {
  id: string;
  campaignId: string;
  type: string;
  status: 'idle' | 'processing' | 'validated' | 'error';
  data: any;
  lastUpdate: string;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
}