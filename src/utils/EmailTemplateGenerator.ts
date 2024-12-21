import { PropertyAnalysis } from './PropertyAnalyzer';

export class EmailTemplateGenerator {
  static generateEmailSequence(analysis: PropertyAnalysis): string[] {
    const templates: string[] = [];
    
    // Email 1: Introduction personnalisée
    const intro = this.generateIntroEmail(analysis);
    templates.push(intro);
    
    // Email 2: Éducation sur le marché
    const education = this.generateEducationEmail(analysis);
    templates.push(education);
    
    // Email 3: Proposition de valeur
    const proposition = this.generatePropositionEmail(analysis);
    templates.push(proposition);

    return templates;
  }

  private static generateIntroEmail(analysis: PropertyAnalysis): string {
    switch (analysis.type) {
      case 'investment':
        return `Objet: Optimisation de votre investissement immobilier\n\n
        Bonjour,\n
        En tant qu'expert en investissement immobilier, j'ai remarqué votre bien et son potentiel intéressant.
        Je souhaiterais échanger avec vous sur les opportunités d'optimisation de votre investissement.\n
        Bien cordialement`;
      
      case 'inheritance':
        return `Objet: Accompagnement personnalisé pour votre bien immobilier\n\n
        Bonjour,\n
        Je comprends que la gestion d'un bien issu d'une succession peut être complexe.
        Je propose un accompagnement sur-mesure pour vous aider dans cette démarche.\n
        Bien cordialement`;
      
      default:
        return `Objet: Votre projet immobilier\n\n
        Bonjour,\n
        Je me permets de vous contacter au sujet de votre bien immobilier.
        En tant que professionnel local, je souhaiterais échanger avec vous sur votre projet.\n
        Bien cordialement`;
    }
  }

  private static generateEducationEmail(analysis: PropertyAnalysis): string {
    const baseTemplate = `Objet: Les tendances du marché immobilier local\n\n
    Bonjour,\n
    Suite à notre premier échange, je souhaitais partager avec vous quelques informations sur le marché immobilier actuel :\n\n`;

    switch (analysis.type) {
      case 'investment':
        return baseTemplate + `
        - Évolution des prix locatifs dans votre secteur
        - Opportunités d'optimisation fiscale
        - Tendances du marché de l'investissement\n
        Bien cordialement`;
      
      default:
        return baseTemplate + `
        - Dynamique des prix dans votre quartier
        - Délais moyens de vente
        - Profil des acheteurs actuels\n
        Bien cordialement`;
    }
  }

  private static generatePropositionEmail(analysis: PropertyAnalysis): string {
    const urgencyMessage = analysis.urgency === 'high' 
      ? "Je peux vous proposer une solution rapide et adaptée à votre situation."
      : "Je peux vous accompagner sereinement dans votre projet.";

    return `Objet: Une proposition personnalisée pour votre bien\n\n
    Bonjour,\n
    Après analyse approfondie de votre situation, ${urgencyMessage}\n
    Voici ce que je vous propose :\n
    - Estimation détaillée de votre bien
    - Stratégie de commercialisation personnalisée
    - Accompagnement complet jusqu'à la vente\n
    Quand seriez-vous disponible pour en discuter ?\n
    Bien cordialement`;
  }
}