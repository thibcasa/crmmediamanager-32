import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket, Image, FileText, Target } from 'lucide-react';
import { useWorkflowState } from './hooks/useWorkflowState';
import { PredictionStep } from './PredictionStep';
import { CorrectionStep } from './CorrectionStep';
import { TestStep } from './TestStep';
import { ProductionStep } from './ProductionStep';
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { state, actions } = useWorkflowState(messageToTest);
  const canProceedToProduction = state.currentTestResults.roi >= 2 && state.currentTestResults.engagement >= 0.6;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test & Validation</h3>
          <div className="text-sm text-muted-foreground">
            Itération {state.iterationCount}
          </div>
        </div>

        {/* Ajout de la section de prévisualisation */}
        <Card className="p-4 bg-sage-50">
          <h4 className="text-md font-medium mb-4">Aperçu de la Campagne</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Créatives */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Image className="h-4 w-4 text-sage-600" />
                <h5 className="font-medium">Créatives</h5>
              </div>
              <ScrollArea className="h-[200px]">
                {state.currentTestResults.campaignDetails?.creatives.map((creative, index) => (
                  <div key={index} className="mb-3">
                    <div className="aspect-video bg-white rounded-lg overflow-hidden">
                      <img 
                        src={creative.content} 
                        alt={`Créative ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-sage-600 mt-1">
                      Performance: {(creative.performance * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </Card>

            {/* Contenu */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-sage-600" />
                <h5 className="font-medium">Contenu</h5>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {state.currentTestResults.campaignDetails?.content.messages.map((message, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg">
                      <p className="text-sm">{message}</p>
                    </div>
                  ))}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Accroches</p>
                    {state.currentTestResults.campaignDetails?.content.headlines.map((headline, index) => (
                      <div key={index} className="text-sm text-sage-600">
                        • {headline}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </Card>

            {/* Stratégie */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-sage-600" />
                <h5 className="font-medium">Stratégie</h5>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Ciblage</p>
                    <div className="space-y-1">
                      {state.currentTestResults.audienceInsights?.demographics.location.map((loc, index) => (
                        <div key={index} className="text-sm text-sage-600">
                          • {loc}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Segments</p>
                    {state.currentTestResults.audienceInsights?.segments.map((segment, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between text-sm">
                          <span>{segment.name}</span>
                          <span className="text-sage-600">{(segment.score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-sage-200 rounded-full mt-1">
                          <div 
                            className="h-full bg-sage-600 rounded-full"
                            style={{ width: `${segment.potential * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </Card>

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