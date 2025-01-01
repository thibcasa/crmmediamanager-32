export interface WorkflowConfig {
  platform: string;
  targetAudience: string;
  location: string;
  messageType: string;
  frequency: string;
  name?: string;
  keywords?: string[];
  stages?: Array<{
    name: string;
    criteria: Record<string, any>;
  }>;
  actions?: Array<{
    type: string;
    template: string;
    delay: string;
    content: string;
    conditions?: Record<string, any>;
  }>;
}

export interface WorkflowResult {
  visualData?: any;
  campaignData?: any;
  pipelineData?: any;
  automationData?: any;
  calendarData?: any;
}