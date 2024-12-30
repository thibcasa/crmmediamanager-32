import { useState, useEffect } from 'react';
import { ModuleType, ModuleState, ModuleConfig } from '@/types/modules';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MODULE_CONFIGS: ModuleConfig[] = [
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
    type: 'analysis',
    name: 'Analyse Prédictive',
    description: 'Prédiction des performances',
    requiredScore: 0.8,
    dependsOn: ['pipeline']
  },
  {
    type: 'correction',
    name: 'Correction',
    description: 'Optimisation automatique',
    requiredScore: 0.9,
    dependsOn: ['analysis']
  }
];

export const ModuleOrchestrator = () => {
  const { toast } = useToast();
  const [moduleStates, setModuleStates] = useState<Record<ModuleType, ModuleState>>({
    subject: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    title: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    content: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    creative: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    workflow: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    pipeline: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    analysis: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    correction: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 }
  });

  const getModuleIcon = (status: ModuleState['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const isModuleReady = (config: ModuleConfig): boolean => {
    if (!config.dependsOn) return true;
    return config.dependsOn.every(
      dependency => moduleStates[dependency].status === 'validated'
    );
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODULE_CONFIGS.map((config) => {
          const state = moduleStates[config.type];
          const ready = isModuleReady(config);

          return (
            <Card key={config.type} className={`p-4 ${!ready ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getModuleIcon(state.status)}
                  <h3 className="font-medium">{config.name}</h3>
                </div>
                <Badge variant={state.status === 'validated' ? 'default' : 'secondary'}>
                  {state.validationScore.toFixed(2)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-2">{config.description}</p>
              {state.predictions && (
                <div className="text-xs text-gray-600">
                  <div>Engagement: {(state.predictions.engagement * 100).toFixed(1)}%</div>
                  <div>Conversion: {(state.predictions.conversion * 100).toFixed(1)}%</div>
                  <div>ROI: {state.predictions.roi.toFixed(1)}x</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};