import { supabase } from '@/lib/supabaseClient';

export class ContentGenerationService {
  static async generateOptimizedContent(params: {
    objective: string;
    persona: any;
    platform: string;
    strategy: any;
  }) {
    try {
      const platformPrompts = {
        linkedin: `Créer un article éducatif sur l'importance des estimations immobilières professionnelles. 
                  Ton: professionnel et expert. 
                  Cible: ${params.persona.name}`,
        facebook: `Créer une publication engageante pour promouvoir un formulaire d'estimation gratuite. 
                  Ton: direct et incitatif. 
                  Cible: ${params.persona.name}`,
        instagram: `Créer un script de Reel montrant les étapes d'une estimation immobilière professionnelle. 
                   Ton: dynamique et pédagogique. 
                   Cible: ${params.persona.name}`
      };

      // Générer le contenu avec l'IA
      const { data: content } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          objective: params.objective,
          prompt: platformPrompts[params.platform],
          platform: params.platform,
          contentType: params.strategy.contentType,
          format: params.strategy.format
        }
      });

      // Générer les visuels si nécessaire
      let visuals = [];
      if (params.platform === 'instagram' || params.strategy.format === 'image') {
        const { data: visualsData } = await supabase.functions.invoke('openai-image-generation', {
          body: {
            prompt: `Professional real estate photo for ${params.platform}: ${content.imagePrompt}`,
            n: params.platform === 'instagram' ? 3 : 1,
            size: "1024x1024",
            quality: "standard",
            style: "natural"
          }
        });
        visuals = visualsData.images;
      }

      return {
        template: content.template,
        posts: content.posts.map((post: any, index: number) => ({
          ...post,
          image_url: visuals[index] || null
        })),
        seoTitles: content.seoTitles,
        hashtags: content.hashtags
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }
}