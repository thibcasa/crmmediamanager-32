export type PropertyType = 'investment' | 'primary_residence' | 'vacation' | 'inheritance';

export interface PropertyAnalysis {
  type: PropertyType;
  sellingReason?: string;
  priceRange: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
}

export class PropertyAnalyzer {
  static analyzeProperty(description: string, price?: number): PropertyAnalysis {
    const descLower = description.toLowerCase();
    
    // Analyse du type de bien
    let type: PropertyType = 'primary_residence';
    if (descLower.includes('investissement') || descLower.includes('rendement') || descLower.includes('locataire')) {
      type = 'investment';
    } else if (descLower.includes('succession') || descLower.includes('héritage')) {
      type = 'inheritance';
    } else if (descLower.includes('vacances') || descLower.includes('secondaire')) {
      type = 'vacation';
    }

    // Analyse de l'urgence
    let urgency: PropertyAnalysis['urgency'] = 'medium';
    if (descLower.includes('urgent') || descLower.includes('rapidement')) {
      urgency = 'high';
    } else if (descLower.includes('pas pressé') || descLower.includes('à voir')) {
      urgency = 'low';
    }

    // Analyse de la gamme de prix
    let priceRange: PropertyAnalysis['priceRange'] = 'medium';
    if (price) {
      if (price < 200000) priceRange = 'low';
      else if (price > 500000) priceRange = 'high';
    }

    return {
      type,
      priceRange,
      urgency
    };
  }
}