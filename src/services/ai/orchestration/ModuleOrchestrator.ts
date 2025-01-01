import { ModuleType, ModuleResult } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';
import { ModuleValidationService } from '../validation/ModuleValidationService';
import { ModuleCorrectionService } from '../correction/ModuleCorrectionService';
import { ModuleInterconnectionService } from './ModuleInterconnectionService';
import { SubjectModule } from '../modules/SubjectModule';
import { TitleModule } from '../modules/TitleModule';
import { ContentModule } from '../modules/ContentModule';
import { CreativeModule } from '../modules/CreativeModule';
import { WorkflowModule } from '../modules/WorkflowModule';
import { PipelineModule } from '../modules/PipelineModule';
import { PredictiveModule } from '../modules/PredictiveModule';
import { AnalysisModule } from '../modules/AnalysisModule';
import { CorrectionModule } from '../modules/CorrectionModule';

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

  static async executeModuleChain(initialInput: string) {
    console.log('Starting module chain execution with input:', initialInput);
    let currentInput = initialInput;
    const results: Record<ModuleType, ModuleResult> = {} as Record<ModuleType, ModuleResult>;

    try {
      for (const moduleType of this.MODULE_FLOW) {
        console.log(`Executing module: ${moduleType}`);
        
        // Execute current module
        const result = await this.executeModule(moduleType, currentInput);
        results[moduleType] = result;

        // Validate result
        const validation = await ModuleValidationService.validateModule(moduleType, result);
        
        if (!validation.isValid) {
          console.log(`Module ${moduleType} validation failed, attempting correction`);
          const correctedResult = await ModuleCorrectionService.correctModule(moduleType, result);
          results[moduleType] = correctedResult;
          
          // Validate correction
          const revalidation = await ModuleValidationService.validateModule(moduleType, correctedResult);
          if (!revalidation.isValid) {
            throw new Error(`Module ${moduleType} failed validation after correction`);
          }
        }

        // Prepare input for next module
        currentInput = await this.prepareNextModuleInput(moduleType, result);
        
        // Log execution
        await this.logModuleExecution(moduleType, currentInput, result);
      }

      return results;
    } catch (error) {
      console.error('Error in module chain execution:', error);
      throw error;
    }
  }

  private static async executeModule(type: ModuleType, input: any): Promise<ModuleResult> {
    const moduleService = await this.getModuleService(type);
    return moduleService.execute(input);
  }

  private static async getModuleService(type: ModuleType) {
    switch (type) {
      case 'subject':
        return new SubjectModule();
      case 'title':
        return new TitleModule();
      case 'content':
        return new ContentModule();
      case 'creative':
        return new CreativeModule();
      case 'workflow':
        return new WorkflowModule();
      case 'pipeline':
        return new PipelineModule();
      case 'predictive':
        return new PredictiveModule();
      case 'analysis':
        return new AnalysisModule();
      case 'correction':
        return new CorrectionModule();
      default:
        throw new Error(`Unknown module type: ${type}`);
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
      case 'pipeline':
        return { predictive: result.data.pipelineMetrics };
      case 'predictive':
        return { analysis: result.data.predictions };
      case 'analysis':
        return { correction: result.data.analysisResults };
      default:
        return result.data;
    }
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