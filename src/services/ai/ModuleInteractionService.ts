import { supabase } from '@/lib/supabaseClient';
import { ModuleInteraction, ModuleState } from '@/types/social';

export class ModuleInteractionService {
  static async sendInteraction(interaction: Omit<ModuleInteraction, 'timestamp'>) {
    const { data, error } = await supabase
      .from('automation_logs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: `module_interaction_${interaction.from}_to_${interaction.to}`,
        description: `Interaction from ${interaction.from} to ${interaction.to}`,
        metadata: {
          ...interaction,
          timestamp: new Date().toISOString()
        }
      });

    if (error) throw error;
    return data;
  }

  static async updateModuleState(state: ModuleState) {
    console.log('Updating module state:', state);
    
    const { data, error } = await supabase
      .from('automation_logs')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: `module_state_update_${state.type}`,
        description: `State update for module ${state.type}`,
        metadata: {
          ...state,
          lastUpdate: new Date().toISOString()
        }
      });

    if (error) throw error;
    return data;
  }

  static async getModuleState(moduleId: string, campaignId: string) {
    const { data, error } = await supabase
      .from('automation_logs')
      .select('*')
      .eq('metadata->moduleId', moduleId)
      .eq('metadata->campaignId', campaignId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data?.metadata as ModuleState;
  }
}