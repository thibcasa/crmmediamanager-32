import { ModuleType, ModuleResult, CampaignObjective } from '@/types/modules';
import { ModuleInput } from '../types/ModuleTypes';

export class ModulePreparationService {
  static prepareModuleInput(
    currentModule: ModuleType,
    results: Partial<Record<ModuleType, ModuleResult>>,
    objective: CampaignObjective
  ): ModuleInput {
    // Initialize with common properties
    const baseInput = {
      platform: objective.platform,
      objective: objective.objective,
      previousResults: results
    };

    switch (currentModule) {
      case 'subject':
        return {
          ...baseInput,
          keywords: [],
          audience: 'property_owners'
        };

      case 'title':
        if (!results.subject) {
          throw new Error('Subject result required for title generation');
        }
        return {
          ...baseInput,
          subject: results.subject.data,
          keywords: results.subject.data.keywords || []
        };

      case 'content':
        if (!results.title || !results.subject) {
          throw new Error('Title and subject results required for content generation');
        }
        return {
          ...baseInput,
          title: results.title.data,
          subject: results.subject.data,
          keywords: results.subject.data.keywords || []
        };

      case 'creative':
        if (!results.content) {
          throw new Error('Content result required for creative generation');
        }
        return {
          ...baseInput,
          content: results.content.data
        };

      default:
        return baseInput;
    }
  }
}