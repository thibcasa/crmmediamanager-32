import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarService } from "@/services/CalendarService";
import { ContentGenerationService } from './services/ContentGenerationService';
import { CampaignService } from './services/CampaignService';
import { PipelineService } from './services/PipelineService';
import { AutomationService } from './services/AutomationService';
import { WorkflowConfig, WorkflowResult } from './types/workflow';
import { supabase } from "@/lib/supabaseClient";

export const useAIOrchestrator = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

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
      const visualData = await ContentGenerationService.createVisual(aiResponse, platform);
      console.log('Visual generated successfully');

      // 2. Créer une campagne sociale
      const campaignData = await CampaignService.createCampaign(aiResponse, config);
      console.log('Campaign created successfully');

      // 3. Créer un pipeline de suivi spécifique pour cette campagne
      const pipelineData = await PipelineService.createPipeline({
        ...config,
        name: `Pipeline ${platform} - ${new Date().toLocaleDateString()}`,
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
      });
      console.log('Pipeline created successfully');

      // 4. Créer des automatisations de suivi
      const automationData = await AutomationService.createAutomation({
        ...config,
        actions: [
          {
            type: "send_message",
            template: `follow_up_${platform.toLowerCase()}`,
            delay: "2d",
            content: "Suivi de notre première prise de contact concernant votre bien immobilier"
          },
          {
            type: "create_task",
            template: "qualification_call",
            delay: "4d",
            content: "Appel de qualification pour estimation immobilière"
          },
          {
            type: "schedule_meeting",
            template: "discovery_call",
            delay: "7d",
            conditions: { engagement_score: ">70" },
            content: "Rendez-vous d'estimation sur place"
          }
        ]
      });
      console.log('Automation created successfully');

      // 5. Planifier les revues de performance
      const calendarData = await CalendarService.createMeeting({
        title: `Campagne ${platform} - Revue de performance`,
        description: `Analyse des résultats de la campagne ${platform} et ajustements stratégiques`,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 60,
        type: 'strategy_review',
        status: 'scheduled'
      });
      console.log('Calendar event created successfully');

      // 6. Configurer le suivi analytique
      await supabase.from('workflow_templates').insert({
        name: `Workflow ${platform} - ${new Date().toLocaleDateString()}`,
        description: `Suivi automatisé de la campagne ${platform}`,
        triggers: [
          {
            type: 'campaign_engagement',
            config: { platform, threshold: 0.5 }
          },
          {
            type: 'lead_score_changed',
            config: { min_score: 70 }
          }
        ],
        actions: [
          {
            type: 'analyze_performance',
            config: {
              metrics: ['engagement', 'conversion', 'roi'],
              frequency: 'daily'
            }
          },
          {
            type: 'generate_report',
            config: {
              type: 'performance_summary',
              schedule: 'weekly'
            }
          }
        ]
      });
      console.log('Workflow template created successfully');

      // 7. Poster sur la plateforme sociale
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

      // 8. Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      queryClient.invalidateQueries({ queryKey: ['workflow-templates'] });

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