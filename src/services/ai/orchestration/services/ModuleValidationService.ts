import { ModuleType, ModuleResult } from '@/types/modules';
import { ModuleExecutionContext } from '../types/ModuleTypes';

export class ModuleValidationService {
  static validateModuleOutput(type: ModuleType, data: ModuleResult): boolean {
    if (!data || !data.success) {
      console.error(`Invalid output from module ${type}:`, data);
      return false;
    }

    if (!data.data) {
      console.error(`No data returned from module ${type}`);
      return false;
    }

    return true;
  }

  static validateModuleInput(type: ModuleType, input: any): boolean {
    if (!input) {
      console.error(`No input provided for module ${type}`);
      return false;
    }

    switch (type) {
      case 'subject':
        return !!input.objective;
      case 'title':
        return !!input.subject;
      case 'content':
        return !!input.title;
      case 'creative':
        return !!input.content;
      default:
        return true;
    }
  }

  static prepareExecutionContext(
    currentModule: ModuleType,
    currentResult: ModuleResult,
    allResults: Record<ModuleType, ModuleResult>
  ): ModuleExecutionContext {
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
}