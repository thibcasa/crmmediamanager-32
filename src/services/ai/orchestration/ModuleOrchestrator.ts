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
        
        // Store the result
        results[moduleType] = result;

        // Log module execution
        await this.logModuleExecution(moduleType, moduleInput, result);

        // Prepare and validate input for next module
        if (moduleType !== 'correction') {
          const nextModuleType = this.MODULE_FLOW[this.MODULE_FLOW.indexOf(moduleType) + 1];
          const nextInput = await this.prepareNextModuleInput(moduleType, result, results);
          console.log(`Prepared input for next module ${nextModuleType}:`, nextInput);
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

      // Validate module output
      if (!data || !data.success) {
        throw new Error(`Module ${type} execution failed: ${data?.error || 'Unknown error'}`);
      }

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
    const previousResults = { ...results };
    
    switch (currentModule) {
      case 'subject':
        return {
          objective: objective.objective,
          platform: objective.platform,
          previousResults: null
        };
      case 'title':
        return {
          subject: results.subject?.data,
          platform: objective.platform,
          previousResults: results.subject
        };
      case 'content':
        return {
          title: results.title?.data,
          subject: results.subject?.data,
          platform: objective.platform,
          previousResults: {
            subject: results.subject,
            title: results.title
          }
        };
      case 'creative':
        return {
          content: results.content?.data,
          platform: objective.platform,
          previousResults: {
            subject: results.subject,
            title: results.title,
            content: results.content
          }
        };
      default:
        return {
          previousResults,
          platform: objective.platform,
          objective: objective.objective
        };
    }
  }

  private static async prepareNextModuleInput(
    currentModule: ModuleType,
    currentResult: ModuleResult,
    allResults: Record<ModuleType, ModuleResult>
  ): Promise<any> {
    // Ensure we have valid data to pass to the next module
    if (!currentResult?.data) {
      console.warn(`No valid data from module ${currentModule} to pass to next module`);
      return null;
    }

    // Return structured data for the next module
    return {
      previousModule: currentModule,
      data: currentResult.data,
      context: {
        previousResults: allResults,
        predictions: currentResult.predictions,
        validationScore: currentResult.validationScore
      }
    };
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