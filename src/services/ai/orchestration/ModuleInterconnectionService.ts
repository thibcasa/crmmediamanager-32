import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

export class ModuleInterconnectionService {
  private static readonly MODULE_DEPENDENCIES: Record<ModuleType, ModuleType[]> = {
    subject: [],
    title: ['subject'],
    content: ['title'],
    creative: ['content'],
    workflow: ['creative'],
    pipeline: ['workflow'],
    predictive: ['pipeline'],
    analysis: ['predictive'],
    correction: ['analysis']
  };

  static async propagateResults(
    fromModule: ModuleType,
    toModule: ModuleType,
    result: ModuleResult
  ): Promise<void> {
    console.log(`Propagating results from ${fromModule} to ${toModule}:`, result);

    try {
      // Validate dependency
      if (!this.validateDependency(fromModule, toModule)) {
        throw new Error(`Invalid module dependency: ${fromModule} -> ${toModule}`);
      }

      // Log the interconnection
      await this.logInterconnection(fromModule, toModule, result);

      // Notify dependent modules
      await this.notifyDependentModules(fromModule, toModule, result);
    } catch (error) {
      console.error('Error in module interconnection:', error);
      throw error;
    }
  }

  private static validateDependency(fromModule: ModuleType, toModule: ModuleType): boolean {
    return this.MODULE_DEPENDENCIES[toModule].includes(fromModule);
  }

  static async getDependentModules(moduleType: ModuleType): Promise<ModuleType[]> {
    return Object.entries(this.MODULE_DEPENDENCIES)
      .filter(([_, dependencies]) => dependencies.includes(moduleType))
      .map(([module]) => module as ModuleType);
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
        description: `Notification de ${dependentModule} des mises à jour de ${fromModule}`,
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
        description: `Propagation des données de ${fromModule} vers ${toModule}`,
        metadata: {
          from_module: fromModule,
          to_module: toModule,
          result,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error logging interconnection:', error);
      throw error;
    }
  }
}