export type ModuleType = 'subject' | 'title' | 'content' | 'creative' | 'workflow' | 'pipeline' | 'predictive' | 'correction';

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