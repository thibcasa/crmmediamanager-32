import { useWorkflowExecution } from './hooks/useWorkflowExecution';

export const useAIOrchestrator = () => {
  const { executeWorkflow, isProcessing } = useWorkflowExecution();
  return { executeWorkflow, isProcessing };
};