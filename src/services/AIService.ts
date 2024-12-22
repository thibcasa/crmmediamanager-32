import { supabase } from '@/lib/supabaseClient';
import { RetryService } from './RetryService';

export class AIService {
  static async generateImage(prompt: string) {
    return RetryService.withRetry(
      async () => {
        const { data, error } = await supabase.functions.invoke('huggingface-integration', {
          body: { action: 'generate-image', data: { prompt } }
        });

        if (error) throw error;
        return data;
      },
      { maxAttempts: 3, delayMs: 2000 }
    );
  }

  static async analyzeSentiment(text: string) {
    return RetryService.withRetry(
      async () => {
        const { data, error } = await supabase.functions.invoke('huggingface-integration', {
          body: { action: 'analyze-sentiment', data: { text } }
        });

        if (error) throw error;
        return data;
      },
      { maxAttempts: 3, delayMs: 2000 }
    );
  }

  static async classifyLead(description: string) {
    return RetryService.withRetry(
      async () => {
        const { data, error } = await supabase.functions.invoke('huggingface-integration', {
          body: { action: 'classify-lead', data: { description } }
        });

        if (error) throw error;
        return data;
      },
      { maxAttempts: 3, delayMs: 2000 }
    );
  }

  static async generateContent(type: 'email' | 'social' | 'description', prompt: string, options = {}) {
    console.log('Generating content with prompt:', prompt);
    
    return RetryService.withRetry(
      async () => {
        const { data, error } = await supabase.functions.invoke('content-generator', {
          body: { 
            type,
            prompt,
            targetAudience: "cadres 35-65 ans à Nice",
            tone: "professionnel et stratégique",
            outputFormat: "markdown",
            platforms: ["linkedin"],
            includeMetrics: true,
            ...options
          }
        });

        if (error) {
          console.error('Error generating content:', error);
          throw error;
        }

        console.log('Generated content:', data);
        return data?.content || data;
      },
      { 
        maxAttempts: 3, 
        delayMs: 2000,
        onRetry: (attempt, error) => {
          console.log(`Retry attempt ${attempt} for content generation:`, error);
        }
      }
    );
  }

  static async generateAndPostToLinkedIn(prompt: string) {
    return RetryService.withRetry(
      async () => {
        const content = await this.generateContent('social', prompt, {
          platform: 'linkedin',
          targetAudience: "cadres 35-65 ans à Nice",
          tone: "professionnel et confiant"
        });

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { data, error } = await supabase.functions.invoke('linkedin-integration', {
          body: {
            action: 'post',
            data: {
              userId: userData.user.id,
              content: content
            }
          }
        });

        if (error) throw error;
        return data;
      },
      { maxAttempts: 3, delayMs: 2000 }
    );
  }
}