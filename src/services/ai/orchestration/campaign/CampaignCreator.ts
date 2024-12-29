import { supabase } from '@/lib/supabaseClient';
import { ContentGenerationService } from '../../ContentGenerationService';
import { PlatformStrategy } from '../types/CampaignTypes';

export class CampaignCreator {
  static async createPlatformCampaign(
    platform: string, 
    strategy: PlatformStrategy, 
    persona: any, 
    objective: string
  ) {
    const { data: campaign, error: campaignError } = await supabase
      .from('social_campaigns')
      .insert({
        name: `Campagne ${platform} - ${objective.substring(0, 50)}...`,
        platform,
        status: 'draft',
        persona_id: persona.id,
        targeting_criteria: {
          location: "Nice, Alpes-Maritimes",
          interests: persona.interests,
          property_types: persona.property_types
        },
        content_strategy: {
          content_type: strategy.contentType,
          format: strategy.format,
          frequency: strategy.frequency,
          best_times: strategy.bestTimes,
          approach: strategy.approach
        },
        target_metrics: {
          daily_meetings: 1,
          engagement_rate: 0.05,
          conversion_rate: 0.02
        }
      })
      .select()
      .single();

    if (campaignError) throw campaignError;

    // Générer le contenu adapté à la plateforme
    const content = await ContentGenerationService.generateOptimizedContent({
      objective,
      persona,
      platform,
      strategy
    });

    // Mettre à jour la campagne avec le contenu
    await supabase
      .from('social_campaigns')
      .update({
        message_template: content.template,
        posts: content.posts
      })
      .eq('id', campaign.id);

    return campaign;
  }
}