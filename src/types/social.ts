export interface SocialCampaign {
  id: string;
  user_id?: string;
  platform: string;
  name: string;
  status?: string;
  schedule?: any;
  targeting_criteria?: any;
  message_template?: string;
  created_at?: string;
  updated_at?: string;
  ai_feedback?: any;
  posts?: any[];
  post_triggers?: any[];
  target_metrics?: any;
  persona_id?: string;
  target_locations?: string[];
  content_strategy?: any;
  optimization_cycles?: any[];
  current_prediction?: any;
}