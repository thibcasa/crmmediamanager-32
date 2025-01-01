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

export interface ModuleState {
  status: 'idle' | 'processing' | 'validated' | 'error';
  data: any | null;
  predictions: {
    engagement: number;
    conversion: number;
    roi: number;
  };
  validationScore: number;
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