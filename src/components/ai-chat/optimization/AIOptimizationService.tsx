import { supabase } from "@/lib/supabaseClient";

export class AIOptimizationService {
  static async optimizeContent(content: string, platform: string) {
    const { data, error } = await supabase.functions.invoke('content-optimizer', {
      body: { content, platform }
    });

    if (error) throw error;
    return data;
  }

  static async analyzePerformance(campaignId: string) {
    const { data, error } = await supabase.functions.invoke('performance-analyzer', {
      body: { campaignId }
    });

    if (error) throw error;
    return data;
  }

  static async generateImprovements(campaignId: string, performance: any) {
    const { data, error } = await supabase.functions.invoke('improvement-generator', {
      body: { campaignId, performance }
    });

    if (error) throw error;
    return data;
  }
}