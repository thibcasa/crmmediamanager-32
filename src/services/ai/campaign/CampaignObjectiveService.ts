import { CampaignObjective, GoalType } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

export class CampaignObjectiveService {
  static parseObjective(objective: string): CampaignObjective {
    const mandateMatch = objective.match(/(\d+)\s*mandats?/i);
    const weeklyMatch = objective.includes('semaine') || objective.includes('hebdomadaire');
    const monthlyMatch = objective.includes('mois') || objective.includes('mensuel');
    
    let goalType: GoalType = 'custom';
    let mandateGoal: number | undefined;
    let frequency: 'daily' | 'weekly' | 'monthly' = 'weekly';

    // Détection du type d'objectif
    if (mandateMatch) {
      goalType = 'mandate_generation';
      mandateGoal = parseInt(mandateMatch[1]);
    } else if (objective.toLowerCase().includes('lead')) {
      goalType = 'lead_generation';
    } else if (objective.toLowerCase().includes('notoriété') || objective.toLowerCase().includes('visibilité')) {
      goalType = 'brand_awareness';
    } else if (objective.toLowerCase().includes('vente') || objective.toLowerCase().includes('vendre')) {
      goalType = 'sales';
    }

    // Détection de la fréquence
    if (weeklyMatch) frequency = 'weekly';
    else if (monthlyMatch) frequency = 'monthly';
    else frequency = 'daily';

    return {
      objective,
      goalType,
      platform: 'linkedin',
      mandateGoal,
      frequency,
      customMetrics: {
        engagement: 0.1,
        conversion: 0.05,
        roi: 2
      }
    };
  }

  static async createCampaign(objective: CampaignObjective) {
    const { data: campaign, error } = await supabase
      .from('social_campaigns')
      .insert({
        name: `Campagne ${objective.goalType} - ${objective.objective}`,
        platform: objective.platform,
        status: 'active',
        targeting_criteria: {
          location: "Alpes-Maritimes",
          interests: ["Immobilier", "Investissement immobilier"],
          property_types: ["Appartement", "Maison", "Villa"]
        },
        target_metrics: {
          weekly_mandates: objective.mandateGoal || 0,
          engagement_rate: 0.05,
          conversion_rate: 0.02
        }
      })
      .select()
      .single();

    if (error) throw error;
    return campaign;
  }

  static async trackProgress(campaignId: string) {
    const { data: metrics, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('campaign_id', campaignId)
      .single();

    if (error) throw error;
    return metrics;
  }
}