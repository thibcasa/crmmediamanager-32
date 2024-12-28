import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket, BarChart2 } from 'lucide-react';
import { WorkflowPhase } from '../types/test-results';

interface WorkflowTabsProps {
  activePhase: WorkflowPhase;
  onPhaseChange: (phase: WorkflowPhase) => void;
  canProceedToProduction: boolean;
}

export const WorkflowTabs = ({ 
  activePhase, 
  onPhaseChange,
  canProceedToProduction 
}: WorkflowTabsProps) => {
  return (
    <TabsList className="grid grid-cols-5 w-full">
      <TabsTrigger 
        value="prediction" 
        onClick={() => onPhaseChange('prediction')}
        className="flex items-center gap-2"
      >
        <Brain className="h-4 w-4" />
        Prédiction
      </TabsTrigger>
      <TabsTrigger 
        value="correction" 
        onClick={() => onPhaseChange('correction')}
        className="flex items-center gap-2"
      >
        <Wrench className="h-4 w-4" />
        Correction
      </TabsTrigger>
      <TabsTrigger 
        value="test" 
        onClick={() => onPhaseChange('test')}
        className="flex items-center gap-2"
      >
        <TestTube className="h-4 w-4" />
        Test
      </TabsTrigger>
      <TabsTrigger 
        value="production" 
        onClick={() => onPhaseChange('production')}
        className="flex items-center gap-2"
        disabled={!canProceedToProduction}
      >
        <Rocket className="h-4 w-4" />
        Production
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        onClick={() => onPhaseChange('analytics')}
        className="flex items-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        Analytics
      </TabsTrigger>
    </TabsList>
  );
};