import { AIService } from '@/services/AIService';
import { WorkflowConfig } from '../types/workflow';

export class ContentGenerationService {
  static async generateContent(prompt: string, config: WorkflowConfig) {
    try {
      console.log('Generating content with config:', config);
      const content = await AIService.generateContent('social', prompt, {
        platform: config.platform,
        targetAudience: config.targetAudience,
        location: config.location
      });
      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  static async createVisual(prompt: string, platform: string) {
    try {
      console.log('Generating visual for platform:', platform);
      const visualData = await AIService.generateImage(
        `Professional real estate photo in Nice, French Riviera, modern style, optimized for ${platform}`
      );
      return visualData;
    } catch (error) {
      console.error('Error generating visual:', error);
      throw error;
    }
  }
}