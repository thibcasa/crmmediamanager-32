import { supabase } from "@/lib/supabaseClient";

export class ConfigurationService {
  static async saveConfiguration(configType: string, configData: any, description?: string) {
    try {
      // Get the latest version number for this config type
      const { data: versions, error: versionError } = await supabase
        .from('configuration_history')
        .select('version')
        .eq('configuration_type', configType)
        .order('version', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      const newVersion = versions && versions.length > 0 ? versions[0].version + 1 : 1;

      // Insert new configuration
      const { data, error } = await supabase
        .from('configuration_history')
        .insert([
          {
            configuration_type: configType,
            configuration_data: configData,
            version: newVersion,
            description: description || `Backup version ${newVersion}`,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Set previous versions as inactive
      if (data) {
        const { error: updateError } = await supabase
          .from('configuration_history')
          .update({ is_active: false })
          .eq('configuration_type', configType)
          .neq('id', data.id);

        if (updateError) throw updateError;
      }

      console.log('Configuration saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  static async getLatestConfiguration(configType: string) {
    try {
      const { data, error } = await supabase
        .from('configuration_history')
        .select('*')
        .eq('configuration_type', configType)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting configuration:', error);
      throw error;
    }
  }
}