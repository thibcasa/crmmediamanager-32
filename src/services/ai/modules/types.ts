export type ModuleType = 
  | 'subject'
  | 'title'
  | 'content'
  | 'creative'
  | 'workflow'
  | 'pipeline'
  | 'predictive'
  | 'correction';

export interface ModuleResult {
  success: boolean;
  data: any;
  predictions?: {
    engagement?: number;
    conversion?: number;
    performance?: number;
  };
  metrics?: Record<string, number>;
}

export interface BaseModule {
  execute(input: any): Promise<ModuleResult>;
  predict(data: any): Promise<any>;
  optimize(data: any, target: any): Promise<any>;
}