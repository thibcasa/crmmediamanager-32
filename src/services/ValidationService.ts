export class ValidationService {
  static validatePrompt(prompt: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Vérification de la longueur minimale
    if (prompt.length < 10) {
      errors.push("Le prompt est trop court pour être efficace");
    }

    // Vérification des mots-clés essentiels pour l'immobilier
    const requiredKeywords = ['mandat', 'propriétaire', 'bien', 'vente', 'achat'];
    const promptLower = prompt.toLowerCase();
    const missingKeywords = requiredKeywords.filter(keyword => !promptLower.includes(keyword));
    
    if (missingKeywords.length > 0) {
      errors.push(`Mots-clés recommandés manquants: ${missingKeywords.join(', ')}`);
    }

    // Vérification de la structure
    if (!prompt.includes('?') && !prompt.includes('.')) {
      errors.push("Le prompt manque de structure claire (pas de ponctuation)");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static correctPrompt(prompt: string): string {
    let correctedPrompt = prompt;

    // Ajout de la ponctuation si nécessaire
    if (!correctedPrompt.endsWith('.') && !correctedPrompt.endsWith('?')) {
      correctedPrompt += '.';
    }

    // Capitalisation de la première lettre
    correctedPrompt = correctedPrompt.charAt(0).toUpperCase() + correctedPrompt.slice(1);

    return correctedPrompt;
  }
}