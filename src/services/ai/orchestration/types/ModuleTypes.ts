import { ModuleType, ModuleResult } from '@/types/modules';

export interface ModuleExecutionContext {
  previousModule?: ModuleType;
  data: any;
  context: {
    previousResults: Record<ModuleType, ModuleResult>;
    predictions?: {
      engagement: number;
      conversion: number;
      roi: number;
    };
    validationScore?: number;
  };
}

export interface ModuleInput {
  objective?: string;
  platform?: string;
  previousResults?: Partial<Record<ModuleType, ModuleResult>>;
  data?: any;
  keywords?: string[];
  subject?: any;
  title?: any;
  content?: any;
}