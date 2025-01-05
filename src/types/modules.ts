export type ModuleType = 
  | 'subject'
  | 'title'
  | 'content'
  | 'creative'
  | 'workflow'
  | 'pipeline'
  | 'predictive'
  | 'analysis'
  | 'correction';

export type GoalType = 
  | 'mandate_generation' 
  | 'lead_generation' 
  | 'brand_awareness' 
  | 'sales' 
  | 'custom';

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

export interface ModuleConfig {
  type: ModuleType;
  name: string;
  description: string;
  requiredScore: number;
  dependsOn?: ModuleType[];
}

export interface CampaignObjective {
  objective: string;
  goalType: GoalType;
  platform: 'linkedin' | 'facebook' | 'instagram';
  mandateGoal?: number;
  frequency?: 'daily' | 'weekly' | 'monthly';
  customMetrics?: {
    [key: string]: number;
  };
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