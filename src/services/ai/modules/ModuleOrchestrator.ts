import { supabase } from '@/lib/supabaseClient';
import { ModuleType } from './types';
import { SubjectModule } from './SubjectModule';
import { TitleModule } from './TitleModule';
import { ContentModule } from './ContentModule';
import { CreativeModule } from './CreativeModule';
import { WorkflowModule } from './WorkflowModule';
import { PipelineModule } from './PipelineModule';
import { PredictiveModule } from './PredictiveModule';
import { CorrectionModule } from './CorrectionModule';
import { ModuleValidationService } from '../validation/ModuleValidationService';
import { ModuleCorrectionService } from '../correction/ModuleCorrectionService';
import { ModuleInterconnectionService } from '../orchestration/ModuleInterconnectionService';

export class ModuleOrchestrator {
  private modules: Map<ModuleType, any>;

  constructor() {
    this.modules = new Map();
    this.initializeModules();
  }

  private initializeModules() {
    this.modules.set('subject', new SubjectModule());
    this.modules.set('title', new TitleModule());
    this.modules.set('content', new ContentModule());
    this.modules.set('creative', new CreativeModule());
    this.modules.set('workflow', new WorkflowModule());
    this.modules.set('pipeline', new PipelineModule());
    this.modules.set('predictive', new PredictiveModule());
    this.modules.set('correction', new CorrectionModule());
  }

  async executeModule(type: ModuleType, input: any) {
    console.log(`Executing module: ${type}`, input);
    
    const module = this.modules.get(type);
    if (!module) {
      throw new Error(`Module ${type} not found`);
    }

    try {
      // Execute module
      let result = await module.execute(input);
      
      // Validate results
      const validation = await ModuleValidationService.validateModule(type, result);
      
      // If not valid, attempt automatic correction
      if (!validation.isValid) {
        console.log(`Module ${type} validation failed. Attempting correction...`);
        result = await ModuleCorrectionService.correctModule(type, result);
        
        // Validate again after correction
        const revalidation = await ModuleValidationService.validateModule(type, result);
        if (!revalidation.isValid) {
          console.warn(`Module ${type} still invalid after correction`);
        }
      }

      // Propagate results to dependent modules
      const dependentModules = await ModuleInterconnectionService.getDependentModules(type);
      for (const dependentModule of dependentModules) {
        await ModuleInterconnectionService.propagateResults(type, dependentModule, result);
      }

      // Log execution
      await this.logExecution(type, input, result);
      
      return result;
    } catch (error) {
      console.error(`Error executing module ${type}:`, error);
      throw error;
    }
  }

  private async logExecution(type: ModuleType, input: any, output: any) {
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
        module_type: type
      }
    });
  }
}