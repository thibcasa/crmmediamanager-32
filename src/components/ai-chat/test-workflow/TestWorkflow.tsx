import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket, BarChart2 } from 'lucide-react';
import { useWorkflowState } from './hooks/useWorkflowState';
import { PredictionStep } from './PredictionStep';
import { CorrectionStep } from './CorrectionStep';
import { TestStep } from './TestStep';
import { ProductionStep } from './ProductionStep';
import { TestMetrics } from './TestMetrics';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { state, actions } = useWorkflowState(messageToTest);
  const { toast } = useToast();
  const canProceedToProduction = state.currentTestResults.roi >= 2 && state.currentTestResults.engagement >= 0.6;

  const handlePhaseChange = (phase: string) => {
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test & Validation</h3>
          <div className="text-sm text-muted-foreground">
            Itération {state.iterationCount}
          </div>
        </div>

        {state.isAnalyzing && (
          <div className="space-y-2">
            <Progress value={state.progress} />
            <p className="text-sm text-center text-muted-foreground">
              Analyse en cours... {state.progress}%
            </p>
          </div>
        )}

        <Tabs 
          value={state.activePhase} 
          onValueChange={handlePhaseChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full">
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
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Production
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
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
            
            {state.currentTestResults && (
              <div className="mt-6">
                <TestMetrics results={state.currentTestResults} />
              </div>
            )}
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
            <Card className="p-6">
              <h4 className="text-lg font-medium mb-4">Analyse des Performances</h4>
              {state.testHistory.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p className="text-sm font-medium">Progression ROI</p>
                      <p className="text-2xl font-bold">
                        {(state.currentTestResults.roi * 100).toFixed(1)}%
                      </p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-sm font-medium">Progression Engagement</p>
                      <p className="text-2xl font-bold">
                        {(state.currentTestResults.engagement * 100).toFixed(1)}%
                      </p>
                    </Card>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Historique des itérations</h5>
                    {state.testHistory.map((result, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-center">
                          <span>Itération {index + 1}</span>
                          <span className="text-sm text-muted-foreground">
                            ROI: {(result.roi * 100).toFixed(1)}% | 
                            Engagement: {(result.engagement * 100).toFixed(1)}%
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Aucune donnée d'analyse disponible. Commencez par tester votre campagne.
                  </AlertDescription>
                </Alert>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};