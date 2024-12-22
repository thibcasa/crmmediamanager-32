export type SocialPlatform = 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'whatsapp';
export type LinkedInConnectionStatus = 'active' | 'expired' | 'revoked';

export interface SocialCampaign {
  id: string;
  user_id?: string;
  platform: SocialPlatform;
  name: string;
  status?: string;
  schedule?: Record<string, any>;
  targeting_criteria?: Record<string, any>;
  message_template?: string;
  created_at?: string;
  updated_at?: string;
}