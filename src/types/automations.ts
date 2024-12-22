export type AutomationTriggerType = 
  | 'lead_created'
  | 'lead_updated'
  | 'meeting_scheduled'
  | 'message_received'
  | 'score_changed'
  | 'campaign_engagement';

export type AutomationActionType =
  | 'send_email'
  | 'send_message'
  | 'update_lead'
  | 'create_task'
  | 'schedule_meeting'
  | 'generate_content'
  | 'analyze_sentiment'
  | 'update_score';

export interface Automation {
  id: string;
  user_id: string;
  name: string;
  trigger_type: string;
  trigger_config: Record<string, any>;
  actions: Record<string, any>[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  ai_enabled?: boolean;
  ai_feedback?: Record<string, any>[];
  performance_metrics?: Record<string, any>;
  last_optimized_at?: string;
}