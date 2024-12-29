export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audience_segments: {
        Row: {
          created_at: string | null
          criteria: Json | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
        Relationships: []
      }
      error_logs: {
        Row: {
          component: string | null
          correction_applied: string | null
          created_at: string | null
          error_message: string
          error_type: string
          id: string
          metadata: Json | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          component?: string | null
          correction_applied?: string | null
          created_at?: string | null
          error_message: string
          error_type: string
          id?: string
          metadata?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          component?: string | null
          correction_applied?: string | null
          created_at?: string | null
          error_message?: string
          error_type?: string
          id?: string
          metadata?: Json | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      lead_interactions: {
        Row: {
          channel: string | null
          completed_at: string | null
          content: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          scheduled_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          channel?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          scheduled_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          channel?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          scheduled_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          consent_details: Json | null
          created_at: string
          email: string
          first_name: string
          gdpr_consent: boolean | null
          gdpr_consent_date: string | null
          id: string
          last_contact_date: string
          last_name: string
          notes: string | null
          persona_type: string | null
          phone: string | null
          pipeline_stage_id: string | null
          qualification:
            | Database["public"]["Enums"]["contact_qualification"]
            | null
          score: number
          source: Database["public"]["Enums"]["lead_source"]
          source_campaign: string | null
          source_platform: string | null
          status: Database["public"]["Enums"]["lead_status"]
          user_id: string
        }
        Insert: {
          consent_details?: Json | null
          created_at?: string
          email: string
          first_name: string
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          last_contact_date?: string
          last_name: string
          notes?: string | null
          persona_type?: string | null
          phone?: string | null
          pipeline_stage_id?: string | null
          qualification?:
            | Database["public"]["Enums"]["contact_qualification"]
            | null
          score?: number
          source: Database["public"]["Enums"]["lead_source"]
          source_campaign?: string | null
          source_platform?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          user_id: string
        }
        Update: {
          consent_details?: Json | null
          created_at?: string
          email?: string
          first_name?: string
          gdpr_consent?: boolean | null
          gdpr_consent_date?: string | null
          id?: string
          last_contact_date?: string
          last_name?: string
          notes?: string | null
          persona_type?: string | null
          phone?: string | null
          pipeline_stage_id?: string | null
          qualification?:
            | Database["public"]["Enums"]["contact_qualification"]
            | null
          score?: number
          source?: Database["public"]["Enums"]["lead_source"]
          source_campaign?: string | null
          source_platform?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          user_id?: string
        }
        Relationships: []
      }
      linkedin_connections: {
        Row: {
          access_token: string
          created_at: string | null
          expires_in: number
          id: string
          linkedin_id: string
          refresh_token: string
          status:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
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
          status?:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
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
          status?:
            | Database["public"]["Enums"]["linkedin_connection_status"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          duration: number
          id: string
          lead_id: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          duration?: number
          id?: string
          lead_id?: string | null
          status?: string
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          duration?: number
          id?: string
          lead_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      multichannel_campaigns: {
        Row: {
          channels: Json | null
          content: Json | null
          created_at: string | null
          description: string | null
          id: string
          metrics: Json | null
          name: string
          schedule: Json | null
          status: string | null
          targeting: Json | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          channels?: Json | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name: string
          schedule?: Json | null
          status?: string | null
          targeting?: Json | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          channels?: Json | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          schedule?: Json | null
          status?: string | null
          targeting?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      objection_scripts: {
        Row: {
          category: string
          created_at: string | null
          effectiveness_score: number | null
          id: string
          objection: string
          response: string
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          objection: string
          response: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          effectiveness_score?: number | null
          id?: string
          objection?: string
          response?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      personas: {
        Row: {
          age_range: Json
          created_at: string | null
          id: string
          income_range: Json | null
          interests: string[]
          job_titles: string[]
          name: string
          property_types: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age_range?: Json
          created_at?: string | null
          id?: string
          income_range?: Json | null
          interests?: string[]
          job_titles?: string[]
          name: string
          property_types?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age_range?: Json
          created_at?: string | null
          id?: string
          income_range?: Json | null
          interests?: string[]
          job_titles?: string[]
          name?: string
          property_types?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_campaigns: {
        Row: {
          ai_feedback: Json | null
          content_strategy: Json | null
          created_at: string | null
          current_prediction: Json | null
          id: string
          message_template: string | null
          name: string
          optimization_cycles: Json | null
          persona_id: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_triggers: Json | null
          posts: Json | null
          schedule: Json | null
          status: string | null
          target_locations: string[] | null
          target_metrics: Json | null
          targeting_criteria: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_feedback?: Json | null
          content_strategy?: Json | null
          created_at?: string | null
          current_prediction?: Json | null
          id?: string
          message_template?: string | null
          name: string
          optimization_cycles?: Json | null
          persona_id?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_triggers?: Json | null
          posts?: Json | null
          schedule?: Json | null
          status?: string | null
          target_locations?: string[] | null
          target_metrics?: Json | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_feedback?: Json | null
          content_strategy?: Json | null
          created_at?: string | null
          current_prediction?: Json | null
          id?: string
          message_template?: string | null
          name?: string
          optimization_cycles?: Json | null
          persona_id?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          post_triggers?: Json | null
          posts?: Json | null
          schedule?: Json | null
          status?: string | null
          target_locations?: string[] | null
          target_metrics?: Json | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_campaigns_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      social_interactions: {
        Row: {
          content: string | null
          created_at: string | null
          engagement_score: number | null
          id: string
          interaction_type: string
          lead_id: string | null
          metadata: Json | null
          optimization_feedback: Json | null
          platform: string
          sentiment_score: number | null
          user_id: string
          workflow_step: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_type: string
          lead_id?: string | null
          metadata?: Json | null
          optimization_feedback?: Json | null
          platform: string
          sentiment_score?: number | null
          user_id: string
          workflow_step?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          interaction_type?: string
          lead_id?: string | null
          metadata?: Json | null
          optimization_feedback?: Json | null
          platform?: string
          sentiment_score?: number | null
          user_id?: string
          workflow_step?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      target_locations: {
        Row: {
          city: string
          created_at: string | null
          department: string
          id: string
          postal_code: string
          priority: number | null
          region: string
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          department: string
          id?: string
          postal_code: string
          priority?: number | null
          region: string
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          department?: string
          id?: string
          postal_code?: string
          priority?: number | null
          region?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      automation_action_type:
        | "send_email"
        | "send_message"
        | "update_lead"
        | "create_task"
        | "schedule_meeting"
        | "generate_content"
        | "analyze_sentiment"
        | "update_score"
      automation_trigger_type:
        | "lead_created"
        | "lead_updated"
        | "meeting_scheduled"
        | "message_received"
        | "score_changed"
        | "campaign_engagement"
      contact_qualification: "lead" | "prospect" | "client"
      lead_source: "facebook" | "instagram" | "linkedin" | "direct"
      lead_status: "cold" | "warm" | "hot"
      linkedin_connection_status: "active" | "expired" | "revoked"
      social_platform:
        | "linkedin"
        | "twitter"
        | "facebook"
        | "instagram"
        | "tiktok"
        | "whatsapp"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
