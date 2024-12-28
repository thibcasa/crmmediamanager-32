import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWorkflowState } from './hooks/useWorkflowState';
import { PredictionStep } from './PredictionStep';
import { CorrectionStep } from './CorrectionStep';
import { TestStep } from './TestStep';
import { ProductionStep } from './ProductionStep';
import { CampaignHeader } from './CampaignHeader';
import { CampaignTabs } from './CampaignTabs';
import { CampaignData } from '../types/campaign';

interface CampaignWorkflowManagerProps {
  initialData?: CampaignData;
  onUpdate?: (updates: Partial<CampaignData>) => void;
}

export const CampaignWorkflowManager = ({ initialData, onUpdate }: CampaignWorkflowManagerProps) => {
  const { state, actions } = useWorkflowState(initialData?.objective);
  const canProceedToProduction = state.currentTestResults.roi >= 2 && state.currentTestResults.engagement >= 0.6;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <CampaignHeader iterationCount={state.iterationCount} />

        <Tabs 
          value={state.activePhase} 
          onValueChange={(value: any) => actions.setActivePhase(value)} 
          className="w-full"
        >
          <CampaignTabs canProceedToProduction={canProceedToProduction} />

          <TabsContent value="prediction">
            <PredictionStep
              isAnalyzing={state.isAnalyzing}
              progress={state.progress}
              testResults={state.currentTestResults}
              onAnalyze={actions.handleTest}
              messageToTest={initialData?.objective}
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
        </Tabs>
      </div>
    </Card>
  );
};