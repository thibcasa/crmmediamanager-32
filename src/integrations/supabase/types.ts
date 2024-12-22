import { Meeting, MeetingType } from '@/types/meetings';
import { Lead, LeadSource, LeadStatus } from '@/types/leads';
import { Automation, AutomationTriggerType, AutomationActionType } from '@/types/automations';
import { SocialCampaign, SocialPlatform, LinkedInConnectionStatus } from '@/types/social';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: Meeting;
        Insert: Omit<Meeting, 'id'>;
        Update: Partial<Meeting>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id'>;
        Update: Partial<Lead>;
      };
      automations: {
        Row: Automation;
        Insert: Omit<Automation, 'id'>;
        Update: Partial<Automation>;
      };
      social_campaigns: {
        Row: SocialCampaign;
        Insert: Omit<SocialCampaign, 'id'>;
        Update: Partial<SocialCampaign>;
      };
      automation_templates: {
        Row: {
          actions: Json | null
          ai_generated: boolean | null
          created_at: string | null
          description: string | null
          effectiveness_score: number | null
          id: string
          name: string
          trigger_config: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          ai_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          name: string
          trigger_config?: Json | null
          trigger_type: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          ai_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          name?: string
          trigger_config?: Json | null
          trigger_type?: Database["public"]["Enums"]["automation_trigger_type"]
          updated_at?: string | null
        }
      }
      content_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          seo_metadata: Json | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          seo_metadata?: Json | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          seo_metadata?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      conversation_analytics: {
        Row: {
          analyzed_at: string | null
          engagement_score: number | null
          id: string
          lead_id: string
          message_content: string
          next_actions: Json | null
          sentiment_score: number | null
        }
        Insert: {
          analyzed_at?: string | null
          engagement_score?: number | null
          id?: string
          lead_id: string
          message_content: string
          next_actions?: Json | null
          sentiment_score?: number | null
        }
        Update: {
          analyzed_at?: string | null
          engagement_score?: number | null
          id?: string
          lead_id?: string
          message_content?: string
          next_actions?: Json | null
          sentiment_score?: number | null
        }
      }
      generated_visuals: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          metadata: Json | null
          platform: string
          prompt: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          metadata?: Json | null
          platform: string
          prompt: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          metadata?: Json | null
          platform?: string
          prompt?: string
          status?: string | null
          user_id?: string
        }
      }
      linkedin_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_in: number
          id: string
          linkedin_id: string
          refresh_token: string
          status: Database["public"]["Enums"]["linkedin_connection_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_in: number
          id?: string
          linkedin_id: string
          refresh_token: string
          status?: Database["public"]["Enums"]["linkedin_connection_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_in?: number
          id?: string
          linkedin_id?: string
          refresh_token?: string
          status?: Database["public"]["Enums"]["linkedin_connection_status"] | null
          updated_at?: string | null
          user_id?: string
        }
      }
      pipeline_stages: {
        Row: {
          automation_rules: Json | null
          created_at: string | null
          id: string
          name: string
          next_stage_conditions: Json | null
          order_index: number
          required_actions: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          automation_rules?: Json | null
          created_at?: string | null
          id?: string
          name: string
          next_stage_conditions?: Json | null
          order_index: number
          required_actions?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          automation_rules?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          next_stage_conditions?: Json | null
          order_index?: number
          required_actions?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
      }
    };
    Enums: {
      automation_action_type: AutomationActionType;
      automation_trigger_type: AutomationTriggerType;
      lead_source: LeadSource;
      lead_status: LeadStatus;
      linkedin_connection_status: LinkedInConnectionStatus;
      social_platform: SocialPlatform;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];