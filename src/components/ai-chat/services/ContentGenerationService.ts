import { AIService } from '@/services/AIService';
import { WorkflowConfig } from '../types/workflow';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/components/ui/use-toast";

const RETRY_DELAY = 2000; // 2 secondes
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
      console.log('Generating visual for platform:', platform);
      
      const { data, error } = await supabase.functions.invoke('huggingface-integration', {
        body: { prompt }
      });

      if (error) {
        // Si on a une erreur de rate limit
        if (error.status === 429) {
          if (retryCount < MAX_RETRIES) {
            console.log(`Tentative ${retryCount + 1}/${MAX_RETRIES} - Attente de ${RETRY_DELAY}ms`);
            
            // Notification à l'utilisateur
            toast({
              title: "Limite atteinte",
              description: `Nouvelle tentative dans ${RETRY_DELAY/1000} secondes...`,
            });
            
            // Attendre avant de réessayer
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return this.createVisual(prompt, platform, retryCount + 1);
          }
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error generating visual:', error);
      
      // Si on a épuisé toutes les tentatives
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