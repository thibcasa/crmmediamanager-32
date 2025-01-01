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

export interface ModuleConfig {
  type: ModuleType;
  name: string;
  description: string;
  requiredScore: number;
  dependsOn?: ModuleType[];
  icon?: string;
  enabled?: boolean;
}

export interface ModuleState {
  status: 'idle' | 'processing' | 'validated' | 'error';
  data: any | null;
  success?: boolean;
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
  optimizations?: {
    suggestions: string[];
    priority: 'high' | 'medium' | 'low';
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