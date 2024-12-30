import { ModuleConfig } from '@/types/modules';

export const MODULE_CONFIGS: ModuleConfig[] = [
  {
    type: 'subject',
    name: 'Sujet',
    description: 'Identification des sujets pertinents',
    requiredScore: 0.7
  },
  {
    type: 'title',
    name: 'Titre',
    description: 'Génération de titres optimisés SEO',
    requiredScore: 0.75,
    dependsOn: ['subject']
  },
  {
    type: 'content',
    name: 'Rédaction',
    description: 'Création de contenu optimisé',
    requiredScore: 0.8,
    dependsOn: ['title']
  },
  {
    type: 'creative',
    name: 'Créatif',
    description: 'Génération de visuels',
    requiredScore: 0.75,
    dependsOn: ['content']
  },
  {
    type: 'workflow',
    name: 'Workflow',
    description: 'Configuration des automatisations',
    requiredScore: 0.8,
    dependsOn: ['creative']
  },
  {
    type: 'pipeline',
    name: 'Pipeline',
    description: 'Suivi des conversions',
    requiredScore: 0.85,
    dependsOn: ['workflow']
  },
  {
    type: 'predictive',
    name: 'Prédictif',
    description: 'Analyse prédictive des performances',
    requiredScore: 0.8,
    dependsOn: ['pipeline']
  },
  {
    type: 'analysis',
    name: 'Analyse',
    description: 'Analyse des résultats',
    requiredScore: 0.8,
    dependsOn: ['predictive']
  },
  {
    type: 'correction',
    name: 'Correction',
    description: 'Optimisation automatique',
    requiredScore: 0.9,
    dependsOn: ['analysis']
  }
];