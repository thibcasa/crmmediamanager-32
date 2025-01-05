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
    priority: 'low' | 'medium' | 'high';
  };
}