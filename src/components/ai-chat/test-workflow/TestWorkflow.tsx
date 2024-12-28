import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket } from 'lucide-react';
import { useWorkflowState } from './hooks/useWorkflowState';
import { PredictionStep } from './PredictionStep';
import { CorrectionStep } from './CorrectionStep';
import { TestStep } from './TestStep';
import { ProductionStep } from './ProductionStep';
import { CampaignOverview } from '../campaign-workflow/CampaignOverview';
import { useToast } from "@/hooks/use-toast";

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { state, actions } = useWorkflowState(messageToTest);
  const { toast } = useToast();
  const canProceedToProduction = state.currentTestResults.roi >= 2 && state.currentTestResults.engagement >= 0.6;

  const handlePrediction = async () => {
    try {
      await actions.handlePrediction();
      toast({
        title: "Prédiction générée",
        description: "Les résultats ont été mis à jour"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer la prédiction",
        variant: "destructive"
      });
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    // Modify the original prompt based on the recommendation
    if (messageToTest) {
      const updatedPrompt = `${messageToTest} (Amélioration: ${recommendation})`;
      actions.setMessageToTest(updatedPrompt);
      toast({
        title: "Prompt mis à jour",
        description: "Le message a été modifié selon la recommandation"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test & Validation</h3>
          <div className="text-sm text-muted-foreground">
            Itération {state.iterationCount}
          </div>
        </div>

        <CampaignOverview
          creatives={state.creatives || []}
          content={state.content || []}
          onPredictionClick={handlePrediction}
          onRecommendationClick={handleRecommendationClick}
          recommendations={state.currentTestResults.recommendations || []}
        />

        <Tabs 
          value={state.activePhase} 
          onValueChange={(value: any) => actions.setActivePhase(value)} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Prédiction
            </TabsTrigger>
            <TabsTrigger value="correction" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Correction
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test
            </TabsTrigger>
            <TabsTrigger 
              value="production" 
              className="flex items-center gap-2"
              disabled={!canProceedToProduction}
            >
              <Rocket className="h-4 w-4" />
              Production
            </TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </Card>
  );
};