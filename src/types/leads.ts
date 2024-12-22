export type LeadSource = 'facebook' | 'instagram' | 'linkedin' | 'direct';
export type LeadStatus = 'cold' | 'warm' | 'hot';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  last_contact_date: string;
  notes?: string;
  created_at: string;
  user_id: string;
  gdpr_consent?: boolean;
  gdpr_consent_date?: string;
  source_platform?: string;
  source_campaign?: string;
  persona_type?: string;
  consent_details?: Record<string, any>;
  pipeline_stage_id?: string;
}