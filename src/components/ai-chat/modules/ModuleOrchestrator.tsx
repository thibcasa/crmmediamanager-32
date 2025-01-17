import { useState, useEffect } from 'react';
import { ModuleType, ModuleState, ModuleConfig } from '@/types/modules';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertCircle, Loader2, TrendingUp } from "lucide-react";
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

export const ModuleOrchestrator = () => {
  const { toast } = useToast();
  const [moduleStates, setModuleStates] = useState<Record<ModuleType, ModuleState>>({
    subject: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    title: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    content: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    creative: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    workflow: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    pipeline: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    predictive: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    analysis: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    correction: { status: 'idle', data: null, success: false, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 }
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

  const getMetricColor = (value: number) => {
    if (value >= 0.8) return 'text-green-500';
    if (value >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              
              <p className="text-sm text-gray-500 mb-4">{config.description}</p>
              
              <div className="space-y-3">
                {/* Validation Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Validation</span>
                    <span>{(state.validationScore * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={state.validationScore * 100} />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Engagement</div>
                    <div className={`text-sm font-medium ${getMetricColor(state.predictions.engagement)}`}>
                      {(state.predictions.engagement * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Conversion</div>
                    <div className={`text-sm font-medium ${getMetricColor(state.predictions.conversion)}`}>
                      {(state.predictions.conversion * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">ROI</div>
                    <div className={`text-sm font-medium ${getMetricColor(state.predictions.roi)}`}>
                      {state.predictions.roi.toFixed(1)}x
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                {state.status === 'processing' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-500 mt-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
