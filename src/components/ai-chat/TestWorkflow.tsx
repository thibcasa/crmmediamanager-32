import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ValidationService } from '@/services/ValidationService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket } from 'lucide-react';
import { TestResults } from './test-workflow/types';
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
  const [testResults, setTestResults] = useState<TestResults>({
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
      
      const results = {
        engagement: 0.85,
        clickRate: 0.125,
        conversionRate: 0.032,
        cpa: 15,
        roi: 2.5,
        recommendations: [
          "Ajoutez plus de détails sur la localisation",
          "Précisez le type de bien immobilier",
          "Incluez des informations sur le prix"
        ],
        risks: [
          "Coût par acquisition élevé",
          "Ciblage trop large"
        ],
        opportunities: [
          "Fort potentiel d'engagement",
          "Zone géographique attractive"
        ]
      };

      setTestResults(results);
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
    setActivePhase('production');
    toast({
      title: "Mise en production",
      description: "Déploiement de la campagne optimisée...",
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test & Validation</h3>
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
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Production
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction">
            <PredictionStep
              isAnalyzing={isAnalyzing}
              progress={progress}
              testResults={testResults}
              onAnalyze={handleTest}
              messageToTest={messageToTest}
            />
          </TabsContent>

          <TabsContent value="correction">
            <CorrectionStep
              validationErrors={validationErrors}
              onApplyCorrections={handleCorrection}
              testResults={testResults}
            />
          </TabsContent>

          <TabsContent value="test">
            <TestStep
              isAnalyzing={isAnalyzing}
              onTest={handleTest}
              testResults={testResults}
            />
          </TabsContent>

          <TabsContent value="production">
            <ProductionStep
              onDeploy={handleProduction}
              testResults={testResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};