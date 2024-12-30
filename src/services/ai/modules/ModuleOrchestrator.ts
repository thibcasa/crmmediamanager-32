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
      const result = await module.execute(input);
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