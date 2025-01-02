import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';
import { ModuleValidationService } from './services/ModuleValidationService';
import { ModulePreparationService } from './services/ModulePreparationService';
import { CampaignObjective } from '@/types/modules';

export class ModuleOrchestrator {
  private static readonly MODULE_FLOW: ModuleType[] = [
    'subject',
    'title',
    'content',
    'creative',
    'workflow',
    'pipeline',
    'predictive',
    'analysis',
    'correction'
  ];

  static async executeModuleChain(objective: CampaignObjective) {
    console.log('Starting module chain execution with objective:', objective);
    const results: Record<ModuleType, ModuleResult> = {} as Record<ModuleType, ModuleResult>;

    try {
      await this.logOrchestrationStart(objective);

      for (const moduleType of this.MODULE_FLOW) {
        console.log(`Executing module: ${moduleType}`);
        
        const moduleInput = ModulePreparationService.prepareModuleInput(moduleType, results, objective);
        
        if (!ModuleValidationService.validateModuleInput(moduleType, moduleInput)) {
          throw new Error(`Invalid input for module ${moduleType}`);
        }

        const result = await this.executeModule(moduleType, moduleInput);
        
        if (!ModuleValidationService.validateModuleOutput(moduleType, result)) {
          throw new Error(`Invalid output from module ${moduleType}`);
        }

        results[moduleType] = result;
        await this.logModuleExecution(moduleType, moduleInput, result);

        if (moduleType !== 'correction') {
          const nextModuleType = this.MODULE_FLOW[this.MODULE_FLOW.indexOf(moduleType) + 1];
          const context = ModuleValidationService.prepareExecutionContext(moduleType, result, results);
          console.log(`Prepared context for next module ${nextModuleType}:`, context);
        }
      }

      return results;
    } catch (error) {
      console.error('Error in module chain execution:', error);
      throw error;
    }
  }

  private static async executeModule(type: ModuleType, input: any): Promise<ModuleResult> {
    try {
      const { data, error } = await supabase.functions.invoke('module-execution', {
        body: {
          moduleType: type,
          input: input
        }
      });

      if (error) throw error;

      if (!data || !data.success) {
        throw new Error(`Module ${type} execution failed: ${data?.error || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error(`Error executing module ${type}:`, error);
      throw error;
    }
  }

  private static async logOrchestrationStart(objective: CampaignObjective) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No user found for logging orchestration start');
      return;
    }

    await supabase.from('automation_logs').insert({
      user_id: user.id,
      action_type: 'orchestration_start',
      description: `Started orchestration for objective: ${objective.objective}`,
      metadata: {
        objective,
        timestamp: new Date().toISOString()
      }
    });
  }

  private static async logModuleExecution(type: ModuleType, input: any, output: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No user found for logging module execution');
      return;
    }

    await supabase.from('automation_logs').insert({
      user_id: user.id,
      action_type: `module_execution_${type}`,
      description: `Executed ${type} module`,
      metadata: {
        input,
        output,
        module_type: type,
        timestamp: new Date().toISOString()
      }
    });
  }
}