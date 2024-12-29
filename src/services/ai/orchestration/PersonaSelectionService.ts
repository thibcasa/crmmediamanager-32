import { supabase } from '@/lib/supabaseClient';

export class PersonaSelectionService {
  static async selectOptimalPersona(objective: string) {
    try {
      // Analyser l'objectif avec l'IA pour extraire les critères clés
      const { data: aiAnalysis } = await supabase.functions.invoke('content-analyzer', {
        body: { 
          content: objective,
          type: 'persona_matching'
        }
      });

      // Récupérer tous les personas disponibles
      const { data: personas } = await supabase
        .from('personas')
        .select('*');

      if (!personas?.length) {
        throw new Error('Aucun persona disponible');
      }

      // Calculer le score de correspondance pour chaque persona
      const scoredPersonas = personas.map(persona => ({
        ...persona,
        matchScore: this.calculateMatchScore(persona, aiAnalysis.criteria)
      }));

      // Retourner le persona avec le meilleur score
      const bestMatch = scoredPersonas.reduce((best, current) => 
        current.matchScore > best.matchScore ? current : best
      , scoredPersonas[0]);

      console.log('Persona sélectionné automatiquement:', bestMatch);
      return bestMatch;
    } catch (error) {
      console.error('Erreur lors de la sélection du persona:', error);
      throw error;
    }
  }

  private static calculateMatchScore(persona: any, criteria: any) {
    let score = 0;
    
    // Vérifier la correspondance des tranches d'âge
    if (persona.age_range && criteria.age_range) {
      if (
        persona.age_range.min <= criteria.age_range.target &&
        persona.age_range.max >= criteria.age_range.target
      ) {
        score += 2;
      }
    }

    // Vérifier la correspondance des centres d'intérêt
    if (persona.interests && criteria.interests) {
      const matchingInterests = persona.interests.filter(
        (interest: string) => criteria.interests.includes(interest)
      );
      score += matchingInterests.length;
    }

    // Vérifier la correspondance des types de biens
    if (persona.property_types && criteria.property_types) {
      const matchingTypes = persona.property_types.filter(
        (type: string) => criteria.property_types.includes(type)
      );
      score += matchingTypes.length * 2;
    }

    return score;
  }
}