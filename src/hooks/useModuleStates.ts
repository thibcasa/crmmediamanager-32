import { useState, useEffect } from 'react';
import { ModuleState, ModuleType } from '@/types/modules';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './use-toast';

interface ModuleStateUpdatePayload {
  type: ModuleType;
  state: Partial<ModuleState>;
}

interface AutomationLogRecord {
  metadata: ModuleStateUpdatePayload;
}

// Type guard to check if the payload has the correct structure
const isModuleStateUpdate = (metadata: unknown): metadata is ModuleStateUpdatePayload => {
  if (!metadata || typeof metadata !== 'object') return false;
  const payload = metadata as Record<string, unknown>;
  return (
    'type' in payload &&
    'state' in payload &&
    typeof payload.type === 'string'
  );
};

export const useModuleStates = () => {
  const { toast } = useToast();
  const [moduleStates, setModuleStates] = useState<Record<ModuleType, ModuleState>>({
    subject: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    title: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    content: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    creative: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    workflow: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    pipeline: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    predictive: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    analysis: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 },
    correction: { status: 'idle', data: null, predictions: { engagement: 0, conversion: 0, roi: 0 }, validationScore: 0 }
  });

  useEffect(() => {
    const subscription = supabase
      .channel('module-states')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'automation_logs',
        filter: `action_type=eq.module_state_update` 
      }, (payload) => {
        const record = payload.new as AutomationLogRecord | null;
        if (record?.metadata && isModuleStateUpdate(record.metadata)) {
          setModuleStates(prev => ({
            ...prev,
            [record.metadata.type]: {
              ...prev[record.metadata.type],
              ...record.metadata.state
            }
          }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateModuleState = async (type: ModuleType, updates: Partial<ModuleState>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        return;
      }

      await supabase.from('automation_logs').insert({
        user_id: user.id,
        action_type: 'module_state_update',
        description: `Module ${type} state updated`,
        metadata: {
          type,
          state: updates,
          timestamp: new Date().toISOString()
        }
      });

      setModuleStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          ...updates
        }
      }));
    } catch (error) {
      console.error('Error updating module state:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'état du module",
        variant: "destructive",
      });
    }
  };

  return {
    moduleStates,
    updateModuleState
  };
};