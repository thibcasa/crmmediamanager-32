import { supabase } from '@/lib/supabaseClient';
import { GetSecretsResponse } from '@/types/supabase';

export interface Meeting {
  id: string;
  prospectId: string;
  date: Date;
  duration: number;
  type: 'discovery' | 'follow_up' | 'closing';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export class CalendarService {
  static async createMeeting(meeting: Omit<Meeting, 'id'>) {
    const { data: secrets } = await supabase.functions.invoke<GetSecretsResponse>('get-secrets');
    
    // Implement Google Calendar event creation
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secrets.GOOGLE_CALENDAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        summary: `Meeting with Prospect ${meeting.prospectId}`,
        start: {
          dateTime: meeting.date.toISOString()
        },
        end: {
          dateTime: new Date(meeting.date.getTime() + meeting.duration * 60000).toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    // Save meeting in Supabase
    const { data, error } = await supabase
      .from('meetings')
      .insert([meeting])
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