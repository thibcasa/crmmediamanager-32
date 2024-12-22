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
      automations: {
        Row: {
          actions: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actions: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_config?: Json
          trigger_type?: string
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
        Relationships: [
          {
            foreignKeyName: "conversation_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
          score?: number
          source?: Database["public"]["Enums"]["lead_source"]
          source_campaign?: string | null
          source_platform?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_pipeline_stage_id_fkey"
            columns: ["pipeline_stage_id"]
            isOneToOne: false
            referencedRelation: "pipeline_stages"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: []
      }
      pipelines: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          stages: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          stages?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          stages?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_campaigns: {
        Row: {
          created_at: string | null
          id: string
          message_template: string | null
          name: string
          platform: Database["public"]["Enums"]["social_platform"]
          schedule: Json | null
          status: string | null
          targeting_criteria: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_template?: string | null
          name: string
          platform: Database["public"]["Enums"]["social_platform"]
          schedule?: Json | null
          status?: string | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message_template?: string | null
          name?: string
          platform?: Database["public"]["Enums"]["social_platform"]
          schedule?: Json | null
          status?: string | null
          targeting_criteria?: Json | null
          updated_at?: string | null
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
      lead_source: "facebook" | "instagram" | "linkedin" | "direct"
      lead_status: "cold" | "warm" | "hot"
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
