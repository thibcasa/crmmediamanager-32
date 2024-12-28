import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ValidationService } from '@/services/ValidationService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket } from 'lucide-react';
import { TestResults } from './types/test-results';
import { PredictionStep } from './test-workflow/PredictionStep';
import { CorrectionStep } from './test-workflow/CorrectionStep';
import { TestStep } from './test-workflow/TestStep';
import { ProductionStep } from './test-workflow/ProductionStep';

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<'prediction' | 'correction' | 'test' | 'production'>('prediction');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testStatus, setTestStatus] = useState<'pending' | 'warning' | 'success'>('pending');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [iterationCount, setIterationCount] = useState(0);
  const [testHistory, setTestHistory] = useState<TestResults[]>([]);
  const [currentTestResults, setCurrentTestResults] = useState<TestResults>({
    engagement: 0,
    clickRate: 0,
    conversionRate: 0,
    cpa: 0,
    roi: 0,
    recommendations: [],
    risks: [],
    opportunities: []
  });

  const updateProgress = (phase: number) => {
    setProgress(phase * 25);
  };

  const handleTest = async () => {
    if (!messageToTest) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord envoyer un message dans le chat",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setValidationErrors([]);
    
    try {
      updateProgress(1);
      const validation = ValidationService.validatePrompt(messageToTest);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setTestStatus('warning');
        toast({
          title: "Attention",
          description: "Des améliorations sont suggérées pour votre campagne",
          variant: "destructive"
        });
      }

      updateProgress(2);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate improved results with each iteration
      const iterationMultiplier = 1 + (iterationCount * 0.15);
      const results = {
        engagement: Math.min(0.85 * iterationMultiplier, 1),
        clickRate: Math.min(0.125 * iterationMultiplier, 0.3),
        conversionRate: Math.min(0.032 * iterationMultiplier, 0.1),
        cpa: Math.max(15 / iterationMultiplier, 8),
        roi: Math.min(2.5 * iterationMultiplier, 5),
        recommendations: [
          "Optimisez le ciblage géographique",
          "Précisez le type de bien immobilier",
          "Ajoutez des témoignages clients"
        ],
        risks: [
          "Coût par acquisition à surveiller",
          "Ciblage à affiner"
        ],
        opportunities: [
          "Fort potentiel d'engagement",
          "Zone géographique attractive"
        ]
      };

      setCurrentTestResults(results);
      setTestHistory(prev => [...prev, results]);
      setIterationCount(prev => prev + 1);
      updateProgress(4);
      setTestStatus(validation.isValid ? 'success' : 'warning');

      return results;
    } catch (error) {
      console.error('Error in test workflow:', error);
      setTestStatus('warning');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant l'analyse",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const handleCorrection = () => {
    setActivePhase('correction');
    toast({
      title: "Correction en cours",
      description: "Application des recommandations...",
    });
  };

  const handleProduction = () => {
    if (currentTestResults.roi < 2 || currentTestResults.engagement < 0.6) {
      toast({
        title: "Attention",
        description: "Les performances ne sont pas encore optimales. Continuez les itérations.",
        variant: "destructive"
      });
      return;
    }

    setActivePhase('production');
    toast({
      title: "Mise en production",
      description: "Déploiement de la campagne optimisée...",
    });
  };

  const canProceedToProduction = currentTestResults.roi >= 2 && currentTestResults.engagement >= 0.6;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test & Validation</h3>
          <div className="text-sm text-muted-foreground">
            Itération {iterationCount}
          </div>
        </div>

        <Tabs value={activePhase} onValueChange={(value: any) => setActivePhase(value)} className="w-full">
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
              isAnalyzing={isAnalyzing}
              progress={progress}
              testResults={currentTestResults}
              onAnalyze={handleTest}
              messageToTest={messageToTest}
              iterationCount={iterationCount}
            />
          </TabsContent>

          <TabsContent value="correction">
            <CorrectionStep
              validationErrors={validationErrors}
              onApplyCorrections={handleCorrection}
              testResults={currentTestResults}
              previousResults={testHistory[testHistory.length - 2]}
            />
          </TabsContent>

          <TabsContent value="test">
            <TestStep
              isAnalyzing={isAnalyzing}
              onTest={handleTest}
              testResults={currentTestResults}
              previousResults={testHistory[testHistory.length - 2]}
              iterationCount={iterationCount}
            />
          </TabsContent>

          <TabsContent value="production">
            <ProductionStep
              onDeploy={handleProduction}
              testResults={currentTestResults}
              iterationHistory={testHistory}
              canProceed={canProceedToProduction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};