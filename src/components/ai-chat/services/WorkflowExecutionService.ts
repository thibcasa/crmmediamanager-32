import { toast } from "@/components/ui/use-toast";
import { CalendarService } from "@/services/CalendarService";
import { ContentGenerationService } from './ContentGenerationService';
import { CampaignService } from './CampaignService';
import { PipelineService } from './PipelineService';
import { AutomationService } from './AutomationService';
import { WorkflowConfig } from '../types/workflow';
import { supabase } from "@/lib/supabaseClient";

export class WorkflowExecutionService {
  static async executeVisualGeneration(aiResponse: string, platform: string) {
    const visualData = await ContentGenerationService.createVisual(aiResponse, platform);
    console.log('Visual generated successfully');
    return visualData;
  }

  static async executeCampaignCreation(aiResponse: string, config: WorkflowConfig) {
    const campaignData = await CampaignService.createCampaign(aiResponse, config);
    console.log('Campaign created successfully');
    return campaignData;
  }

  static async executePipelineCreation(config: WorkflowConfig) {
    const pipelineData = await PipelineService.createPipeline({
      ...config,
      name: `Pipeline ${config.platform} - ${new Date().toLocaleDateString()}`,
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
    });
    console.log('Pipeline created successfully');
    return pipelineData;
  }

  static async executeAutomationCreation(config: WorkflowConfig) {
    const automationData = await AutomationService.createAutomation({
      ...config,
      actions: [
        {
          type: "send_message",
          template: `follow_up_${config.platform.toLowerCase()}`,
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
    return automationData;
  }

  static async executeCalendarSetup(platform: string) {
    const calendarData = await CalendarService.createMeeting({
      title: `Campagne ${platform} - Revue de performance`,
      description: `Analyse des résultats de la campagne ${platform} et ajustements stratégiques`,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      duration: 60,
      type: 'strategy_review',
      status: 'scheduled'
    });
    console.log('Calendar event created successfully');
    return calendarData;
  }

  static async executeAnalyticsSetup(platform: string) {
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
  }

  static async executeSocialPosting(platform: string, aiResponse: string) {
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
  }
}