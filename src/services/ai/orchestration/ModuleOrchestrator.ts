import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';

interface CampaignObjective {
  objective: string;
  goalType: string;
  platform: string;
}

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
      // Log the start of orchestration
      await this.logOrchestrationStart(objective);

      // Execute modules in sequence
      for (const moduleType of this.MODULE_FLOW) {
        console.log(`Executing module: ${moduleType}`);
        
        // Get input for current module based on previous results
        const moduleInput = await this.prepareModuleInput(moduleType, results, objective);
        
        // Execute current module
        const result = await this.executeModule(moduleType, moduleInput);
        results[moduleType] = result;

        // Log module execution
        await this.logModuleExecution(moduleType, moduleInput, result);

        // Prepare input for next module
        const nextModuleInput = await this.prepareNextModuleInput(moduleType, result);
        console.log(`Prepared input for next module after ${moduleType}:`, nextModuleInput);
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
      return data;
    } catch (error) {
      console.error(`Error executing module ${type}:`, error);
      throw error;
    }
  }

  private static async prepareModuleInput(
    currentModule: ModuleType,
    results: Record<ModuleType, ModuleResult>,
    objective: CampaignObjective
  ): Promise<any> {
    switch (currentModule) {
      case 'subject':
        return { objective: objective.objective, platform: objective.platform };
      case 'title':
        return { subject: results.subject?.data?.selectedSubject };
      case 'content':
        return { title: results.title?.data?.optimizedTitle };
      case 'creative':
        return { content: results.content?.data?.finalContent };
      case 'workflow':
        return {
          subject: results.subject?.data,
          title: results.title?.data,
          content: results.content?.data,
          creative: results.creative?.data
        };
      default:
        return results[currentModule]?.data || {};
    }
  }

  private static async prepareNextModuleInput(currentModule: ModuleType, result: ModuleResult): Promise<any> {
    // Transform current module result into input for next module
    switch (currentModule) {
      case 'subject':
        return { title: result.data.selectedSubject };
      case 'title':
        return { content: result.data.optimizedTitle };
      case 'content':
        return { creative: result.data.finalContent };
      case 'creative':
        return { workflow: result.data.creativeAssets };
      case 'workflow':
        return { pipeline: result.data.workflowConfig };
      default:
        return result.data;
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