import { AIService } from '@/services/AIService';
import { WorkflowConfig } from '../types/workflow';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

const RETRY_DELAY = 2000;
const MAX_RETRIES = 3;

interface SeoAnalysis {
  keywordDensity: { [key: string]: number };
  readabilityScore: number;
  wordCount: number;
  structure: {
    h1Count: number;
    h2Count: number;
    paragraphCount: number;
  };
}

export class ContentGenerationService {
  static async generateContent(prompt: string, config: WorkflowConfig) {
    try {
      console.log('Generating content with config:', config);
      const content = await AIService.generateContent('social', prompt, {
        platform: config.platform,
        targetAudience: config.targetAudience,
        location: config.location
      });

      // Analyze SEO metrics
      const seoAnalysis = this.analyzeSEO(content, config.keywords || []);
      
      // Store in history
      await this.saveToHistory(prompt, content, config, seoAnalysis);

      return { content, seoAnalysis };
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  private static analyzeSEO(content: string, keywords: string[]): SeoAnalysis {
    const wordCount = content.split(/\s+/).length;
    const keywordDensity: { [key: string]: number } = {};
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = content.match(regex) || [];
      keywordDensity[keyword] = (matches.length / wordCount) * 100;
    });

    // Simple readability score based on sentence length
    const sentences = content.split(/[.!?]+/);
    const avgWordsPerSentence = wordCount / sentences.length;
    const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 5));

    const structure = {
      h1Count: (content.match(/<h1>/g) || []).length,
      h2Count: (content.match(/<h2>/g) || []).length,
      paragraphCount: (content.match(/<p>/g) || []).length,
    };

    return {
      keywordDensity,
      readabilityScore,
      wordCount,
      structure
    };
  }

  private static async saveToHistory(
    prompt: string, 
    content: string, 
    config: WorkflowConfig,
    seoAnalysis: SeoAnalysis
  ) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      await supabase.from('content_templates').insert({
        user_id: userData.user.id,
        name: prompt.substring(0, 50),
        type: config.platform,
        content: content,
        seo_metadata: {
          analysis: seoAnalysis,
          config: config
        }
      });
    } catch (error) {
      console.error('Error saving to history:', error);
      // Don't throw, just log - this shouldn't block content generation
    }
  }

  static async createVisual(prompt: string, platform: string, retryCount = 0) {
    try {
      console.log('Starting visual generation for platform:', platform);
      
      const { data, error } = await supabase.functions.invoke('openai-image-generation', {
        body: { 
          prompt: `Professional real estate photo in Nice, French Riviera, modern style, optimized for ${platform}. ${prompt}`,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      if (error) {
        console.error('Error from OpenAI function:', error);
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} - Waiting ${RETRY_DELAY}ms`);
          
          toast({
            title: "Génération en cours",
            description: `Nouvelle tentative dans ${RETRY_DELAY/1000} secondes...`,
          });
          
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return this.createVisual(prompt, platform, retryCount + 1);
        }
        
        throw error;
      }

      if (!data?.image) {
        throw new Error('Invalid response format: missing image URL');
      }

      return data;
    } catch (error) {
      console.error('Error in createVisual:', error);
      
      if (retryCount >= MAX_RETRIES) {
        toast({
          title: "Erreur",
          description: "Impossible de générer l'image après plusieurs tentatives",
          variant: "destructive"
        });
      }
      
      throw error;
    }
  }
}