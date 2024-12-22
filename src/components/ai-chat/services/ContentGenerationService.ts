import { AIService } from '@/services/AIService';
import { WorkflowConfig } from '../types/workflow';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRIES = 3;

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