import { ModuleType, ModuleResult, CampaignObjective } from '@/types/modules';

interface ModuleInput {
  keywords?: string[];
  subject?: string;
  title?: string;
  content?: string;
  platform: "linkedin" | "facebook" | "instagram";
  objective: string;
  previousResults: Partial<Record<ModuleType, ModuleResult>>;
}

export class ModulePreparationService {
  static prepareModuleInput(
    moduleType: ModuleType,
    previousResults: Partial<Record<ModuleType, ModuleResult>>,
    objective: CampaignObjective
  ): ModuleInput {
    switch (moduleType) {
      case 'subject':
        return {
          keywords: ['immobilier', 'luxe', 'Côte d\'Azur'],
          platform: objective.platform,
          objective: objective.objective,
          previousResults
        };

      case 'title':
        return {
          subject: previousResults.subject?.data,
          platform: objective.platform,
          objective: objective.objective,
          previousResults
        };

      case 'content':
        return {
          title: previousResults.title?.data,
          platform: objective.platform,
          objective: objective.objective,
          previousResults
        };

      case 'creative':
        return {
          content: previousResults.content?.data,
          platform: objective.platform,
          objective: objective.objective,
          previousResults
        };

      default:
        return {
          platform: objective.platform,
          objective: objective.objective,
          previousResults
        };
    }
  }
}