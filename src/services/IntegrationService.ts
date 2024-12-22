import { supabase } from '@/lib/supabaseClient';

export class IntegrationService {
  static async generateContent(prompt: string, type: 'email' | 'social') {
    const { data, error } = await supabase.functions.invoke('content-generator', {
      body: { prompt, type }
    });

    if (error) throw error;
    return data;
  }

  static async sendEmail(to: string[], subject: string, html: string) {
    const { data, error } = await supabase.functions.invoke('email-sender', {
      body: { to, subject, html }
    });

    if (error) throw error;
    return data;
  }

  static async postToLinkedIn(content: string, userId: string, accessToken: string) {
    const { data, error } = await supabase.functions.invoke('linkedin-integration', {
      body: { 
        action: 'post',
        data: { content, userId, accessToken }
      }
    });

    if (error) throw error;
    return data;
  }
}