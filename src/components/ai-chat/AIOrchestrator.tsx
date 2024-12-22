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

      // 3. Créer un pipeline de suivi
      const pipelineData = await PipelineService.createPipeline(config);
      console.log('Pipeline created successfully');

      // 4. Créer une automatisation
      const automationData = await AutomationService.createAutomation(config);
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