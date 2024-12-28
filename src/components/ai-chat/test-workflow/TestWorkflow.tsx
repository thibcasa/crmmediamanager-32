import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWorkflowState } from './hooks/useWorkflowState';
import { useToast } from "@/components/ui/use-toast";
import { PredictionStep } from './PredictionStep';
import { CorrectionStep } from './CorrectionStep';
import { TestStep } from './TestStep';
import { ProductionStep } from './ProductionStep';
import { WorkflowHeader } from './components/WorkflowHeader';
import { WorkflowTabs } from './components/WorkflowTabs';
import { AnalyticsTab } from './components/AnalyticsTab';
import { WorkflowPhase } from './types/test-results';

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { state, actions } = useWorkflowState(messageToTest);
  const { toast } = useToast();
  
  const canProceedToProduction = state.currentTestResults.roi >= 2 && 
                                state.currentTestResults.engagement >= 0.6;

  const handlePhaseChange = (phase: WorkflowPhase) => {
    if (phase === 'production' && !canProceedToProduction) {
      toast({
        title: "Validation requise",
        description: "Les métriques minimales n'ont pas été atteintes pour passer en production.",
        variant: "destructive"
      });
      return;
    }
    actions.setActivePhase(phase);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <WorkflowHeader 
          iterationCount={state.iterationCount}
          isAnalyzing={state.isAnalyzing}
          progress={state.progress}
        />

        <Tabs 
          value={state.activePhase} 
          onValueChange={handlePhaseChange as (value: string) => void}
          className="w-full"
        >
          <WorkflowTabs
            activePhase={state.activePhase}
            onPhaseChange={handlePhaseChange}
            canProceedToProduction={canProceedToProduction}
          />

          <TabsContent value="prediction">
            <PredictionStep
              isAnalyzing={state.isAnalyzing}
              progress={state.progress}
              testResults={state.currentTestResults}
              onAnalyze={actions.handleTest}
              messageToTest={messageToTest}
              iterationCount={state.iterationCount}
            />
          </TabsContent>

          <TabsContent value="correction">
            <CorrectionStep
              validationErrors={state.validationErrors}
              onApplyCorrections={actions.handleCorrection}
              testResults={state.currentTestResults}
              previousResults={state.testHistory[state.testHistory.length - 2]}
            />
          </TabsContent>

          <TabsContent value="test">
            <TestStep
              isAnalyzing={state.isAnalyzing}
              onTest={actions.handleTest}
              testResults={state.currentTestResults}
              previousResults={state.testHistory[state.testHistory.length - 2]}
              iterationCount={state.iterationCount}
            />
          </TabsContent>

          <TabsContent value="production">
            <ProductionStep
              onDeploy={actions.handleProduction}
              testResults={state.currentTestResults}
              iterationHistory={state.testHistory}
              canProceed={canProceedToProduction}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab 
              testHistory={state.testHistory}
              currentResults={state.currentTestResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};