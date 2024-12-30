import { useModuleStates } from '@/hooks/useModuleStates';
import { ModuleBase } from './ModuleBase';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModuleType } from '@/types/modules';

const MODULE_CONFIGS: Array<{
  type: ModuleType;
  title: string;
  description: string;
}> = [
  {
    type: 'subject',
    title: 'Sujet',
    description: 'Identification des sujets pertinents'
  },
  {
    type: 'title',
    title: 'Titre',
    description: 'Génération de titres optimisés SEO'
  },
  {
    type: 'content',
    title: 'Rédaction',
    description: 'Création de contenu optimisé'
  },
  {
    type: 'creative',
    title: 'Créatif',
    description: 'Génération de visuels'
  },
  {
    type: 'workflow',
    title: 'Workflow',
    description: 'Configuration des automatisations'
  },
  {
    type: 'pipeline',
    title: 'Pipeline',
    description: 'Suivi des conversions'
  },
  {
    type: 'predictive',
    title: 'Prédictif',
    description: 'Analyse prédictive des performances'
  },
  {
    type: 'analysis',
    title: 'Analyse',
    description: 'Analyse des résultats'
  },
  {
    type: 'correction',
    title: 'Correction',
    description: 'Optimisation automatique'
  }
];

export const ModuleContainer = () => {
  const { moduleStates, updateModuleState } = useModuleStates();

  return (
    <ScrollArea className="h-[calc(100vh-200px)] px-4">
      <div className="space-y-4 py-4">
        <h2 className="text-2xl font-bold mb-6">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULE_CONFIGS.map((config) => (
            <ModuleBase
              key={config.type}
              type={config.type}
              title={config.title}
              description={config.description}
              state={moduleStates[config.type]}
              onValidate={() => {
                updateModuleState(config.type, {
                  status: 'validated',
                  validationScore: 1
                });
              }}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};