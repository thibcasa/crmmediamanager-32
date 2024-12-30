export type SocialPlatform = "linkedin" | "twitter" | "facebook" | "instagram" | "tiktok" | "whatsapp";

export interface SocialCampaign {
  id: string;
  user_id?: string;
  platform: SocialPlatform;
  name: string;
  status?: string;
  schedule?: Record<string, any>;
  targeting_criteria?: Record<string, any>;
  message_template?: string;
  created_at?: string;
  updated_at?: string;
  ai_feedback?: Record<string, any>;
  posts: any[];
  post_triggers?: any[];
  target_metrics?: Record<string, any>;
  persona_id?: string;
  target_locations?: string[];
  content_strategy?: Record<string, any>;
  optimization_cycles?: any[];
  current_prediction?: Record<string, any>;
}

export interface ModuleResult {
  success: boolean;
  data: any;
  predictions?: {
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
  predict: (data: any) => Promise<Record<string, number>>;
  optimize: (result: ModuleResult) => Promise<ModuleResult>;
}