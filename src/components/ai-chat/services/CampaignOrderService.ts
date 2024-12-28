import { supabase } from "@/lib/supabaseClient";
import { CampaignOrder, CampaignPost } from "../types/campaign-order";

export class CampaignOrderService {
  static async createCampaignFromOrder(order: CampaignOrder) {
    try {
      // 1. Créer la campagne
      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne ${new Date().toLocaleDateString()}`,
          platform: 'linkedin',
          status: 'draft',
          posts: order.posts,
          post_triggers: order.posts.map(post => post.trigger_conditions),
          target_metrics: order.success_metrics,
          targeting_criteria: {
            audience: order.target_audience,
            posting_times: order.workflow_config.optimal_posting_times
          }
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Créer le workflow
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflow_templates')
        .insert({
          name: `Workflow ${campaignData.name}`,
          description: order.objective,
          triggers: [
            {
              type: 'metrics_threshold',
              config: {
                metrics: order.success_metrics
              }
            }
          ],
          actions: [
            {
              type: 'post_content',
              config: {
                frequency: order.workflow_config.frequency,
                max_per_day: order.workflow_config.max_posts_per_day
              }
            },
            {
              type: 'analyze_performance',
              config: {
                metrics: ['engagement', 'leads', 'roi'],
                frequency: 'realtime'
              }
            }
          ]
        })
        .select()
        .single();

      if (workflowError) throw workflowError;

      // 3. Créer les étapes du pipeline
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipeline_stages')
        .insert([
          {
            name: "Qualification initiale",
            order_index: 0,
            automation_rules: [
              {
                condition: "metrics.engagement > 0.3",
                action: "schedule_next_post"
              }
            ]
          },
          {
            name: "Nurturing",
            order_index: 1,
            automation_rules: [
              {
                condition: "metrics.leads > 0",
                action: "activate_lead_workflow"
              }
            ]
          },
          {
            name: "Conversion",
            order_index: 2,
            automation_rules: [
              {
                condition: "metrics.roi >= 2",
                action: "optimize_campaign"
              }
            ]
          }
        ]);

      if (pipelineError) throw pipelineError;

      return {
        campaign: campaignData,
        workflow: workflowData,
        pipeline: pipelineData
      };
    } catch (error) {
      console.error('Error creating campaign from order:', error);
      throw error;
    }
  }

  static async updateCampaignMetrics(campaignId: string, metrics: any) {
    const { data, error } = await supabase
      .from('social_campaigns')
      .update({ 
        ai_feedback: {
          last_metrics: metrics,
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', campaignId)
      .select();

    if (error) throw error;
    return data;
  }
}