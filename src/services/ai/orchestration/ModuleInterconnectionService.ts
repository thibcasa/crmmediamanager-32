import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

export class ModuleInterconnectionService {
  static async propagateResults(
    fromModule: ModuleType,
    toModule: ModuleType,
    result: ModuleResult
  ): Promise<void> {
    console.log(`Propagating results from ${fromModule} to ${toModule}:`, result);

    try {
      // Log the interconnection
      await this.logInterconnection(fromModule, toModule, result);

      // Notify dependent modules
      await this.notifyDependentModules(fromModule, toModule, result);
    } catch (error) {
      console.error('Error in module interconnection:', error);
      throw error;
    }
  }

  static async getDependentModules(moduleType: ModuleType): Promise<ModuleType[]> {
    const dependencies = {
      subject: ['title'],
      title: ['content'],
      content: ['creative'],
      creative: ['workflow'],
      workflow: ['pipeline'],
      pipeline: ['analysis'],
      analysis: ['correction'],
      correction: []
    };

    return dependencies[moduleType] || [];
  }

  private static async notifyDependentModules(
    fromModule: ModuleType,
    toModule: ModuleType,
    result: ModuleResult
  ) {
    const dependentModules = await this.getDependentModules(toModule);
    
    for (const dependentModule of dependentModules) {
      await supabase.from('automation_logs').insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        action_type: 'module_notification',
        description: `Notifying ${dependentModule} of updates from ${fromModule}`,
        metadata: {
          from_module: fromModule,
          to_module: toModule,
          dependent_module: dependentModule,
          result,
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  private static async logInterconnection(
    fromModule: ModuleType,
    toModule: ModuleType,
    result: ModuleResult
  ) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('automation_logs').insert({
        user_id: user?.id,
        action_type: 'module_interconnection',
        description: `Data propagation from ${fromModule} to ${toModule}`,
        metadata: {
          from_module: fromModule,
          to_module: toModule,
          result,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging interconnection:', error);
    }
  }
}