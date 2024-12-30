import { useState } from 'react';
import { ModuleType, ModuleResult } from '@/services/ai/modules/types';
import { ModuleOrchestrator } from '@/services/ai/modules/ModuleOrchestrator';
import { useToast } from './use-toast';

const orchestrator = new ModuleOrchestrator();

export const useAIModule = (type: ModuleType) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ModuleResult | null>(null);
  const { toast } = useToast();

  const execute = async (input: any) => {
    setIsProcessing(true);
    try {
      const moduleResult = await orchestrator.executeModule(type, input);
      setResult(moduleResult);
      
      toast({
        title: "Module exécuté avec succès",
        description: `Le module ${type} a généré des résultats avec un score de performance de ${moduleResult.predictions?.performance || 0}`,
      });

      return moduleResult;
    } catch (error) {
      console.error(`Error executing ${type} module:`, error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de l'exécution du module ${type}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    execute,
    isProcessing,
    result
  };
};