export type MeetingType = 'discovery' | 'follow_up' | 'closing' | 'strategy_review';

export interface Meeting {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string;
  duration: number;
  type: MeetingType;
  status: string;
  lead_id?: string;
  created_at?: string;
  updated_at?: string;
}