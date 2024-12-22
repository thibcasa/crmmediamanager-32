import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { CalendarService } from "@/services/CalendarService";

interface WorkflowResult {
  visualData?: any;
  campaignData?: any;
  pipelineData?: any;
  automationData?: any;
  calendarData?: any;
}

export const useAIOrchestrator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const executeWorkflow = async (aiResponse: string, platform: string) => {
    try {
      console.log(`Starting workflow execution for ${platform}`);
      
      // 1. Générer une image avec HuggingFace
      const { data: visualData, error: visualError } = await supabase.functions.invoke('huggingface-integration', {
        body: { 
          action: 'generate-image',
          data: { prompt: `Professional real estate photo in Nice, French Riviera, modern style, optimized for ${platform}` }
        }
      });

      if (visualError) throw visualError;
      console.log('Visual generated successfully');

      // 2. Créer une campagne sociale
      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${platform} Nice - Propriétaires`,
          platform: platform.toLowerCase(),
          status: 'active',
          targeting_criteria: {
            location: "Nice, Alpes-Maritimes",
            age_range: "35-65",
            job_titles: ["Cadre", "Manager", "Directeur"],
            interests: ["Immobilier", "Investissement"]
          },
          message_template: aiResponse,
          schedule: {
            frequency: "daily",
            times: ["09:00", "12:00", "17:00"],
            days: ["monday", "wednesday", "friday"]
          }
        })
        .select()
        .single();

      if (campaignError) throw campaignError;
      console.log('Campaign created successfully');

      // 3. Créer un pipeline de suivi
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipelines')
        .insert({
          name: `Pipeline ${platform} Nice`,
          description: `Suivi des prospects ${platform} - Propriétaires Nice`,
          stages: [
            {
              name: "Premier contact",
              criteria: { source: platform.toLowerCase(), status: "new" }
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
      console.log('Pipeline created successfully');

      // 4. Créer une automatisation
      const { data: automationData, error: automationError } = await supabase
        .from('automations')
        .insert({
          name: `Suivi ${platform} Nice`,
          trigger_type: "lead_created",
          trigger_config: { source: platform.toLowerCase() },
          actions: [
            {
              type: "send_message",
              template: `follow_up_${platform.toLowerCase()}`,
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
      console.log('Automation created successfully');

      // 5. Planifier dans le calendrier
      const calendarData = await CalendarService.createMeeting({
        title: `Campagne ${platform} - Revue de performance`,
        description: `Analyse des résultats de la campagne ${platform} et ajustements stratégiques`,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
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
    }
  };

  return { executeWorkflow };
};