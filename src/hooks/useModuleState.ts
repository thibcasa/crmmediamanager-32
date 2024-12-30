import { useState, useEffect } from 'react';
import { ModuleState } from '@/types/social';
import { ModuleInteractionService } from '@/services/ai/ModuleInteractionService';
import { useToast } from '@/components/ui/use-toast';

export const useModuleState = (moduleId: string, campaignId: string) => {
  const [state, setState] = useState<ModuleState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadModuleState = async () => {
      try {
        const moduleState = await ModuleInteractionService.getModuleState(moduleId, campaignId);
        setState(moduleState);
      } catch (error) {
        console.error('Error loading module state:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'état du module",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModuleState();
  }, [moduleId, campaignId]);

  const updateState = async (newState: Partial<ModuleState>) => {
    try {
      const updatedState = {
        ...state,
        ...newState,
        id: moduleId,
        campaignId,
        lastUpdate: new Date().toISOString()
      } as ModuleState;

      await ModuleInteractionService.updateModuleState(updatedState);
      setState(updatedState);

      toast({
        title: "État mis à jour",
        description: "L'état du module a été mis à jour avec succès"
      });
    } catch (error) {
      console.error('Error updating module state:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'état du module",
        variant: "destructive"
      });
    }
  };

  return { state, isLoading, updateState };
};