import { ModuleType, ModuleResult, CampaignObjective } from '@/types/modules';
import { ModuleInput } from '../types/ModuleTypes';

export class ModulePreparationService {
  static prepareModuleInput(
    currentModule: ModuleType,
    results: Partial<Record<ModuleType, ModuleResult>>,
    objective: CampaignObjective
  ): ModuleInput {
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
          previousResults: results,
          platform: objective.platform,
          objective: objective.objective
        };
    }
  }
}