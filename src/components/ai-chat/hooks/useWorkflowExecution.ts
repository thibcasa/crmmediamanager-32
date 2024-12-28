import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { WorkflowExecutionService } from '../services/WorkflowExecutionService';
import { WorkflowConfig } from '../types/workflow';

export const useWorkflowExecution = () => {
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
      const visualData = await WorkflowExecutionService.executeVisualGeneration(aiResponse, platform);

      // 2. Créer une campagne sociale
      const campaignData = await WorkflowExecutionService.executeCampaignCreation(aiResponse, config);

      // 3. Créer un pipeline de suivi
      const pipelineData = await WorkflowExecutionService.executePipelineCreation(config);

      // 4. Créer des automatisations
      const automationData = await WorkflowExecutionService.executeAutomationCreation(config);

      // 5. Planifier les revues
      const calendarData = await WorkflowExecutionService.executeCalendarSetup(platform);

      // 6. Configurer le suivi analytique
      await WorkflowExecutionService.executeAnalyticsSetup(platform);

      // 7. Poster sur la plateforme sociale
      await WorkflowExecutionService.executeSocialPosting(platform, aiResponse);

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