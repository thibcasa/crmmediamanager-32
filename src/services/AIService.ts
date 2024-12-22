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

  static async generateContent(type: 'email' | 'social' | 'description', prompt: string) {
    console.log('Generating content with prompt:', prompt);
    
    const { data, error } = await supabase.functions.invoke('content-generator', {
      body: { 
        type,
        prompt,
        targetAudience: "propriétaires immobiliers des Alpes-Maritimes",
        tone: "professionnel, directif et stratégique",
        outputFormat: "markdown"
      }
    });

    if (error) {
      console.error('Error generating content:', error);
      throw error;
    }

    console.log('Generated content:', data);
    return data?.content || data;
  }
}