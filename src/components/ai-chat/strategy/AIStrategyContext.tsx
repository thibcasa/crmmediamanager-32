import { createContext, useContext, useState } from 'react';
import { CampaignObjective } from '@/types/modules';

interface StrategyContextType {
  currentObjective: CampaignObjective | null;
  setCurrentObjective: (objective: CampaignObjective | null) => void;
  isGeneratingStrategy: boolean;
  setIsGeneratingStrategy: (isGenerating: boolean) => void;
}

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export const AIStrategyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentObjective, setCurrentObjective] = useState<CampaignObjective | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

  return (
    <StrategyContext.Provider value={{
      currentObjective,
      setCurrentObjective,
      isGeneratingStrategy,
      setIsGeneratingStrategy
    }}>
      {children}
    </StrategyContext.Provider>
  );
};

export const useAIStrategy = () => {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error('useAIStrategy must be used within an AIStrategyProvider');
  }
  return context;
};