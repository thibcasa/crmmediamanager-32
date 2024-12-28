import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket } from 'lucide-react';
import { useWorkflowState } from './test-workflow/hooks/useWorkflowState';
import { PredictionStep } from './test-workflow/PredictionStep';
import { CorrectionStep } from './test-workflow/CorrectionStep';
import { TestStep } from './test-workflow/TestStep';
import { ProductionStep } from './test-workflow/ProductionStep';
import { useToast } from "@/components/ui/use-toast";
import { useCampaignOrder } from './hooks/useCampaignOrder';

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { toast } = useToast();
  const { state, actions } = useWorkflowState(messageToTest);
  const { createCampaign, updateMetrics } = useCampaignOrder();
  const canProceedToProduction = state.currentTestResults.roi >= 2 && state.currentTestResults.engagement >= 0.6;

  const handleRecommendationClick = async (recommendation: string) => {
    if (messageToTest) {
      const updatedMessage = `${messageToTest}\n\nAméliorations appliquées:\n- ${recommendation}`;
      actions.setMessageToTest(updatedMessage);
      
      try {
        // Créer ou mettre à jour la campagne avec le nouveau message
        const campaignOrder = {
          objective: updatedMessage,
          target_audience: "Propriétaires immobiliers Alpes-Maritimes",
          success_metrics: {
            min_leads: 10,
            target_roi: 2,
            min_engagement: 0.6
          },
          posts: [
            {
              content: updatedMessage,
              trigger_conditions: [
                {
                  metric: "engagement",
                  operator: ">",
                  value: 0.3
                }
              ],
              status: 'draft'
            }
          ],
          workflow_config: {
            frequency: "daily",
            max_posts_per_day: 3,
            optimal_posting_times: ["09:00", "12:00", "17:00"]
          }
        };

        await createCampaign(campaignOrder);

        // Déclencher une nouvelle prédiction
        actions.handlePrediction();
        
        toast({
          title: "Recommandation appliquée",
          description: "Une nouvelle analyse va être lancée avec cette amélioration.",
        });

        // Passer à la phase de prédiction
        actions.setActivePhase('prediction');
      } catch (error) {
        console.error('Error applying recommendation:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'appliquer la recommandation",
          variant: "destructive"
        });
      }
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
              onRecommendationClick={handleRecommendationClick}
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
