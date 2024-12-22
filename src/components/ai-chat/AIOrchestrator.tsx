import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { CalendarService } from "@/services/CalendarService";
import { AIService } from '@/services/AIService';

interface WorkflowResult {
  visualData?: any;
  campaignData?: any;
  pipelineData?: any;
  automationData?: any;
  calendarData?: any;
}

interface WorkflowConfig {
  platform: string;
  targetAudience: string;
  location: string;
  messageType: string;
  frequency: string;
}

export const useAIOrchestrator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const generateContent = async (prompt: string, config: WorkflowConfig) => {
    try {
      console.log('Generating content with config:', config);
      const content = await AIService.generateContent('social', prompt, {
        platform: config.platform,
        targetAudience: config.targetAudience,
        location: config.location
      });
      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  const createVisual = async (prompt: string, platform: string) => {
    try {
      console.log('Generating visual for platform:', platform);
      const visualData = await AIService.generateImage(
        `Professional real estate photo in Nice, French Riviera, modern style, optimized for ${platform}`
      );
      return visualData;
    } catch (error) {
      console.error('Error generating visual:', error);
      throw error;
    }
  };

  const createCampaign = async (content: string, config: WorkflowConfig) => {
    try {
      console.log('Creating campaign with config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${config.platform} Nice - Propriétaires`,
          platform: config.platform.toLowerCase(),
          status: 'active',
          targeting_criteria: {
            location: config.location,
            age_range: "35-65",
            job_titles: ["Cadre", "Manager", "Directeur"],
            interests: ["Immobilier", "Investissement"]
          },
          message_template: content,
          schedule: {
            frequency: config.frequency,
            times: ["09:00", "12:00", "17:00"],
            days: ["monday", "wednesday", "friday"]
          },
          user_id: userData.user.id
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      return campaignData;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };

  const createPipeline = async (config: WorkflowConfig) => {
    try {
      console.log('Creating pipeline for config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipelines')
        .insert({
          name: `Pipeline ${config.platform} Nice`,
          description: `Suivi des prospects ${config.platform} - Propriétaires Nice`,
          user_id: userData.user.id,
          stages: [
            {
              name: "Premier contact",
              criteria: { source: config.platform.toLowerCase(), status: "new" }
            },
            {
              name: "Intéressé",
              criteria: { engagement_score: ">50" }
            },
            {
              name: "Rendez-vous",
              criteria: { meeting_scheduled: true }
            },
            {
              name: "Estimation",
              criteria: { property_evaluated: true }
            }
          ]
        })
        .select()
        .single();

      if (pipelineError) throw pipelineError;
      return pipelineData;
    } catch (error) {
      console.error('Error creating pipeline:', error);
      throw error;
    }
  };

  const createAutomation = async (config: WorkflowConfig) => {
    try {
      console.log('Creating automation for config:', config);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: automationData, error: automationError } = await supabase
        .from('automations')
        .insert({
          name: `Suivi ${config.platform} Nice`,
          user_id: userData.user.id,
          trigger_type: "lead_created",
          trigger_config: { source: config.platform.toLowerCase() },
          actions: [
            {
              type: "send_message",
              template: `follow_up_${config.platform.toLowerCase()}`,
              delay: "2d"
            },
            {
              type: "create_task",
              template: "qualification_call",
              delay: "4d"
            },
            {
              type: "schedule_meeting",
              template: "discovery_call",
              delay: "7d",
              conditions: { engagement_score: ">70" }
            }
          ],
          is_active: true,
          ai_enabled: true
        })
        .select()
        .single();

      if (automationError) throw automationError;
      return automationData;
    } catch (error) {
      console.error('Error creating automation:', error);
      throw error;
    }
  };

  const executeWorkflow = async (aiResponse: string, platform: string) => {
    setIsProcessing(true);
    try {
      console.log(`Starting workflow execution for ${platform}`);
      
      const config: WorkflowConfig = {
        platform,
        targetAudience: "Propriétaires 35-65 ans",
        location: "Nice, Alpes-Maritimes",
        messageType: "prospection",
        frequency: "daily"
      };

      // 1. Générer une image avec HuggingFace
      const visualData = await createVisual(aiResponse, platform);
      console.log('Visual generated successfully');

      // 2. Créer une campagne sociale
      const campaignData = await createCampaign(aiResponse, config);
      console.log('Campaign created successfully');

      // 3. Créer un pipeline de suivi
      const pipelineData = await createPipeline(config);
      console.log('Pipeline created successfully');

      // 4. Créer une automatisation
      const automationData = await createAutomation(config);
      console.log('Automation created successfully');

      // 5. Planifier dans le calendrier
      const calendarData = await CalendarService.createMeeting({
        title: `Campagne ${platform} - Revue de performance`,
        description: `Analyse des résultats de la campagne ${platform} et ajustements stratégiques`,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        type: 'strategy_review',
        status: 'scheduled'
      });
      console.log('Calendar event created successfully');

      // 6. Poster sur la plateforme sociale
      await supabase.functions.invoke('social-media-integration', {
        body: {
          platform: platform.toLowerCase(),
          content: aiResponse,
          schedule: {
            frequency: "daily",
            times: ["09:00", "12:00", "17:00"],
            days: ["monday", "wednesday", "friday"]
          },
          targetingCriteria: {
            location: "Nice",
            ageRange: "35-65",
            interests: ["Immobilier", "Investissement"]
          }
        }
      });
      console.log(`Content scheduled on ${platform} successfully`);

      // 7. Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });

      toast({
        title: "Workflow complet exécuté",
        description: `Campagne créée sur ${platform}, pipeline configuré et automatisations mises en place.`,
      });

      return {
        visualData,
        campaignData,
        pipelineData,
        automationData,
        calendarData
      };

    } catch (error) {
      console.error('Erreur dans l\'exécution du workflow:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution du workflow.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { executeWorkflow, isProcessing };
};