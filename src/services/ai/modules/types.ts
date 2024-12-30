export { ModuleType } from '@/types/modules';

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