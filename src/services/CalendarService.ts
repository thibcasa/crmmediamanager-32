import { supabase } from '@/lib/supabaseClient';

export interface CreateMeetingParams {
  title: string;
  description?: string;
  date: Date;
  duration: number;
  type: 'discovery' | 'follow_up' | 'closing' | 'strategy_review';
  status: string;
  lead_id?: string;
}

export class CalendarService {
  static async createMeeting(params: CreateMeetingParams) {
    const { data, error } = await supabase
      .from('meetings')
      .insert([params])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getMeetings() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  }
}
