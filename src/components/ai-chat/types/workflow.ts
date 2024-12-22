export interface WorkflowConfig {
  platform: string;
  targetAudience: string;
  location: string;
  messageType: string;
  frequency: string;
}

export interface WorkflowResult {
  visualData?: any;
  campaignData?: any;
  pipelineData?: any;
  automationData?: any;
  calendarData?: any;
}