import { supabase } from '@/lib/supabaseClient';
import { CampaignObjective } from '@/types/modules';

export class ContentGenerationService {
  static async generateContent(objective: CampaignObjective) {
    try {
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: { 
          objective: objective.objective,
          goalType: objective.goalType,
          mandateGoal: objective.mandateGoal,
          frequency: objective.frequency
        }
      });

      if (error) throw error;

      // Enregistrer le contenu généré
      await supabase.from('content_templates').insert({
        name: `Template ${objective.goalType}`,
        type: objective.platform,
        content: data.posts[0].content,
        seo_metadata: {
          keywords: ["immobilier", "Alpes-Maritimes", "vente"],
          target_audience: "Propriétaires",
          objective: objective.goalType
        }
      });

      return data;
    } catch (error) {
      console.error('Erreur dans la génération de contenu:', error);
      throw error;
    }
  }

  static async optimizeContent(contentId: string, performance: any) {
    // Optimisation du contenu basée sur les performances
    const { data: content } = await supabase
      .from('content_templates')
      .select('*')
      .eq('id', contentId)
      .single();

    if (!content) throw new Error('Contenu non trouvé');

    // Appeler l'IA pour optimiser le contenu
    const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
      body: { 
        action: 'optimize',
        content,
        performance
      }
    });

    if (error) throw error;
    return data;
  }
}