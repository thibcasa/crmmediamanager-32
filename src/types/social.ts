import { ModuleType } from './modules';

export interface SocialCampaign {
  id: string;
  name: string;
  platform: SocialPlatform;
  status: string;
  content?: string;
  schedule?: any;
  metrics?: any;
}

export type SocialPlatform = 'linkedin' | 'facebook' | 'twitter' | 'instagram';

export interface ModuleState {
  status: 'idle' | 'processing' | 'validated' | 'error';
  data: any | null;
  success: boolean;
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
}