import { Json } from './auth';

export type SocialPlatform = "linkedin" | "twitter" | "facebook" | "instagram" | "tiktok" | "whatsapp";

export interface SocialCampaignTable {
  Row: {
    id: string;
    user_id?: string;
    platform: SocialPlatform;
    name: string;
    status?: string;
    schedule?: Json;
    targeting_criteria?: Json;
    message_template?: string;
    created_at?: string;
    updated_at?: string;
  }
  Insert: {
    id?: string;
    user_id?: string;
    platform: SocialPlatform;
    name: string;
    status?: string;
    schedule?: Json;
    targeting_criteria?: Json;
    message_template?: string;
    created_at?: string;
    updated_at?: string;
  }
  Update: {
    id?: string;
    user_id?: string;
    platform?: SocialPlatform;
    name?: string;
    status?: string;
    schedule?: Json;
    targeting_criteria?: Json;
    message_template?: string;
    created_at?: string;
    updated_at?: string;
  }
}