export type ModuleType = 'subject' | 'title' | 'content' | 'creative' | 'workflow' | 'pipeline' | 'predictive' | 'correction' | 'analysis';

export interface ModuleState {
  status: 'idle' | 'processing' | 'validated' | 'error';
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