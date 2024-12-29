import { supabase } from '@/lib/supabaseClient';

export class ContentGenerationService {
  static async generateOptimizedContent(params: {
    objective: string;
    persona: any;
    platform: string;
    strategy: any;
  }) {
    try {
      // Générer le contenu avec l'IA
      const { data: content } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          objective: params.objective,
          persona: params.persona,
          platform: params.platform,
          contentStrategy: params.strategy
        }
      });

      // Générer les visuels
      const { data: visuals } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompts: content.imagePrompts,
          n: content.posts.length,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      // Associer les visuels aux posts
      const postsWithVisuals = content.posts.map((post: any, index: number) => ({
        ...post,
        image_url: visuals.images[index]
      }));

      return {
        posts: postsWithVisuals,
        template: content.template,
        seoTitles: content.seoTitles,
        hashtags: content.hashtags
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }
}