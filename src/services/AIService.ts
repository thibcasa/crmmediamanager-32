import { supabase } from '@/lib/supabaseClient';

export class AIService {
  static async generateImage(prompt: string) {
    const { data, error } = await supabase.functions.invoke('huggingface-integration', {
      body: { action: 'generate-image', data: { prompt } }
    });

    if (error) throw error;
    return data;
  }

  static async analyzeSentiment(text: string) {
    const { data, error } = await supabase.functions.invoke('huggingface-integration', {
      body: { action: 'analyze-sentiment', data: { text } }
    });

    if (error) throw error;
    return data;
  }

  static async classifyLead(description: string) {
    const { data, error } = await supabase.functions.invoke('huggingface-integration', {
      body: { action: 'classify-lead', data: { description } }
    });

    if (error) throw error;
    return data;
  }

  static async generateContent(type: 'email' | 'social' | 'description', prompt: string, options = {}) {
    console.log('Generating content with prompt:', prompt);
    
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
  }

  static async generateAndPostToLinkedIn(prompt: string) {
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
  }
}