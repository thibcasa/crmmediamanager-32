import { ModuleType } from './modules';

export interface SocialCampaign {
  id: string;
  name: string;
  platform: SocialPlatform;
  status: string;
  content?: string;
  schedule?: any;
  metrics?: any;
  created_at?: string;
  updated_at?: string;
  ai_feedback?: {
    performance_score?: number;
    suggestions?: string[];
  };
  target_metrics?: {
    engagement_rate?: number;
    conversion_rate?: number;
    roi?: number;
  };
  content_strategy?: {
    post_types: string[];
    posting_frequency: string;
  };
  targeting_criteria?: {
    persona?: string;
    location?: string;
  };
}

export type SocialPlatform = 'linkedin' | 'facebook' | 'twitter' | 'instagram' | 'whatsapp';

export interface ModuleState {
  status: 'idle' | 'processing' | 'validated' | 'error';
  data: any | null;
  success: boolean;
  type?: string;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
  validationScore: number;
}

export interface ModuleInteraction {
  type: string;
  data: any;
  timestamp: string;
  from?: string;
  to?: string;
}

export interface AIModule {
  execute(input: any): Promise<ModuleResult>;
  predict(data: any): Promise<{
    engagement: number;
    conversion: number;
    roi: number;
  }>;
  optimize(result: ModuleResult): Promise<ModuleResult>;
}

export interface ModuleResult {
  success: boolean;
  data: any;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
  validationScore: number;
  optimizations?: {
    suggestions: string[];
    priority: 'high' | 'medium' | 'low';
  };
}