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
      ab_tests: {
        Row: {
          end_date: string | null
          id: string
          metadata: Json | null
          performance_score: number | null
          post_id: string
          start_date: string | null
          status: string | null
          user_id: string
          variant_content: string
          variant_type: string
        }
        Insert: {
          end_date?: string | null
          id?: string
          metadata?: Json | null
          performance_score?: number | null
          post_id: string
          start_date?: string | null
          status?: string | null
          user_id: string
          variant_content: string
          variant_type: string
        }
        Update: {
          end_date?: string | null
          id?: string
          metadata?: Json | null
          performance_score?: number | null
          post_id?: string
          start_date?: string | null
          status?: string | null
          user_id?: string
          variant_content?: string
          variant_type?: string
        }
        Relationships: []
      }
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
      automation_logs: {
        Row: {
          action_type: string
          applied_at: string | null
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          applied_at?: string | null
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          applied_at?: string | null
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          action: Json
          condition: Json
          created_at: string | null
          enabled: boolean | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action: Json
          condition: Json
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Json
          condition?: Json
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string | null
          goal_type: string
          id: string
          objective: string
          platform: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          goal_type: string
          id?: string
          objective: string
          platform: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          goal_type?: string
          id?: string
          objective?: string
          platform?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
      crm_workflows: {
        Row: {
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          metrics: Json | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          metrics?: Json | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
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
      generated_titles: {
        Row: {
          created_at: string
          engagement_score: number | null
          generated_title: string
          id: string
          metadata: Json | null
          seo_score: number | null
          status: string | null
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_score?: number | null
          generated_title: string
          id?: string
          metadata?: Json | null
          seo_score?: number | null
          status?: string | null
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_score?: number | null
          generated_title?: string
          id?: string
          metadata?: Json | null
          seo_score?: number | null
          status?: string | null
          subject?: string
          user_id?: string
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
      interactions: {
        Row: {
          channel: string | null
          content: string | null
          created_at: string | null
          direction: string
          duration: number | null
          id: string
          interaction_date: string | null
          lead_id: string | null
          outcome: string | null
          status: string
          subject: string
          type: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          content?: string | null
          created_at?: string | null
          direction: string
          duration?: number | null
          id?: string
          interaction_date?: string | null
          lead_id?: string | null
          outcome?: string | null
          status: string
          subject: string
          type: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          content?: string | null
          created_at?: string | null
          direction?: string
          duration?: number | null
          id?: string
          interaction_date?: string | null
          lead_id?: string | null
          outcome?: string | null
          status?: string
          subject?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      marketing_strategies: {
        Row: {
          approach: Json
          channels: string[]
          content_plan: Json
          created_at: string | null
          expected_results: Json
          id: string
          market_context: Json | null
          objective_target: number
          objective_timeline: Json
          objective_type: Database["public"]["Enums"]["business_objective_type"]
          schedule: Json
          target_audience: Json[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approach: Json
          channels: string[]
          content_plan: Json
          created_at?: string | null
          expected_results: Json
          id?: string
          market_context?: Json | null
          objective_target: number
          objective_timeline: Json
          objective_type: Database["public"]["Enums"]["business_objective_type"]
          schedule: Json
          target_audience: Json[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approach?: Json
          channels?: string[]
          content_plan?: Json
          created_at?: string | null
          expected_results?: Json
          id?: string
          market_context?: Json | null
          objective_target?: number
          objective_timeline?: Json
          objective_type?: Database["public"]["Enums"]["business_objective_type"]
          schedule?: Json
          target_audience?: Json[]
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
      metrics: {
        Row: {
          campaign_id: string | null
          cost_per_lead: number | null
          created_at: string | null
          ctr: number | null
          id: string
          impressions: number | null
          leads_generated: number | null
        }
        Insert: {
          campaign_id?: string | null
          cost_per_lead?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          leads_generated?: number | null
        }
        Update: {
          campaign_id?: string | null
          cost_per_lead?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          leads_generated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
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
      notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          lead_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
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
      performance_metrics: {
        Row: {
          id: string
          metric_type: string
          stage_id: string | null
          timestamp: string | null
          value: number
          workflow_id: string | null
        }
        Insert: {
          id?: string
          metric_type: string
          stage_id?: string | null
          timestamp?: string | null
          value: number
          workflow_id?: string | null
        }
        Update: {
          id?: string
          metric_type?: string
          stage_id?: string | null
          timestamp?: string | null
          value?: number
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "workflow_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "crm_workflows"
            referencedColumns: ["id"]
          },
        ]
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
      post_performances: {
        Row: {
          clicks: number | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          metadata: Json | null
          platform: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          metadata?: Json | null
          platform: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          metadata?: Json | null
          platform?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      social_campaigns: {
        Row: {
          advanced_metrics: Json | null
          ai_feedback: Json | null
          content_strategy: Json | null
          conversion_rate: number | null
          created_at: string | null
          current_prediction: Json | null
          engagement_rate: number | null
          id: string
          message_template: string | null
          name: string
          optimization_cycles: Json | null
          persona_id: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_triggers: Json | null
          posts: Json | null
          reach: number | null
          roi: number | null
          schedule: Json | null
          status: string | null
          target_locations: string[] | null
          target_metrics: Json | null
          targeting_criteria: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          advanced_metrics?: Json | null
          ai_feedback?: Json | null
          content_strategy?: Json | null
          conversion_rate?: number | null
          created_at?: string | null
          current_prediction?: Json | null
          engagement_rate?: number | null
          id?: string
          message_template?: string | null
          name: string
          optimization_cycles?: Json | null
          persona_id?: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          post_triggers?: Json | null
          posts?: Json | null
          reach?: number | null
          roi?: number | null
          schedule?: Json | null
          status?: string | null
          target_locations?: string[] | null
          target_metrics?: Json | null
          targeting_criteria?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          advanced_metrics?: Json | null
          ai_feedback?: Json | null
          content_strategy?: Json | null
          conversion_rate?: number | null
          created_at?: string | null
          current_prediction?: Json | null
          engagement_rate?: number | null
          id?: string
          message_template?: string | null
          name?: string
          optimization_cycles?: Json | null
          persona_id?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          post_triggers?: Json | null
          posts?: Json | null
          reach?: number | null
          roi?: number | null
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
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      workflow_logs: {
        Row: {
          campaign_id: string | null
          created_at: string | null
          id: string
          input: Json | null
          module_name: string
          output: Json | null
          status: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          input?: Json | null
          module_name: string
          output?: Json | null
          status?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          input?: Json | null
          module_name?: string
          output?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_stages: {
        Row: {
          automation_rules: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          order_index: number
          required_score: number | null
          updated_at: string | null
          workflow_id: string | null
        }
        Insert: {
          automation_rules?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          order_index: number
          required_score?: number | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Update: {
          automation_rules?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          required_score?: number | null
          updated_at?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_stages_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "crm_workflows"
            referencedColumns: ["id"]
          },
        ]
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
      business_objective_type:
        | "SALES_MANDATE"
        | "LEAD_GENERATION"
        | "BRAND_AWARENESS"
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
