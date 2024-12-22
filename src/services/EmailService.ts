import { supabase } from '@/lib/supabaseClient';
import { GetSecretsResponse } from '@/types/supabase';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'initial' | 'follow_up' | 'meeting' | 'custom';
}

export interface EmailCampaign {
  id: string;
  name: string;
  templateId: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  scheduledAt?: Date;
  prospects: string[];
}

export class EmailService {
  static async sendEmail(to: string, templateId: string, data: Record<string, any>) {
    const { data: secrets } = await supabase.functions.invoke<GetSecretsResponse>('get-secrets');
    
    // Implement SendGrid email sending logic here
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secrets.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          dynamic_template_data: data
        }],
        from: { email: 'your-verified-sender@domain.com' },
        template_id: templateId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return response;
  }

  static async createTemplate(template: Omit<EmailTemplate, 'id'>) {
    const { data, error } = await supabase
      .from('email_templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getTemplates() {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*');

    if (error) throw error;
    return data;
  }
}