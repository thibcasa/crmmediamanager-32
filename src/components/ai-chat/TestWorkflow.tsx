import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, AlertTriangle, CheckCircle, ArrowRight, Rocket, Wrench, TestTube } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TestMetrics } from './TestMetrics';
import { TestRecommendations } from './TestRecommendations';
import { ValidationService } from '@/services/ValidationService';
import { Progress } from "@/components/ui/progress";
import { TestResults } from './types/test-results';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    recommendations: []
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
      // Phase 1: Validation initiale
      updateProgress(1);
      const validation = ValidationService.validatePrompt(messageToTest);
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setTestStatus('warning');
        toast({
          title: "Attention",
          description: "Des améliorations sont suggérées pour votre prompt",
          variant: "destructive"
        });
      }

      // Phase 2: Correction automatique
      updateProgress(2);
      const correctedPrompt = ValidationService.correctPrompt(messageToTest);
      
      // Phase 3: Analyse des résultats
      updateProgress(3);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        engagement: 0.85,
        clickRate: 0.125,
        conversionRate: 0.032,
        recommendations: [
          "Ajoutez plus de détails sur la localisation",
          "Précisez le type de bien immobilier",
          "Incluez des informations sur le prix"
        ]
      };

      setTestResults(results);

      // Phase 4: Finalisation
      updateProgress(4);
      setTestStatus(validation.isValid ? 'success' : 'warning');
      setActivePhase('prediction');

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
    // Ici, implémenter la logique de correction
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
          <div className="flex items-center gap-2">
            {testStatus === 'warning' && (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            {testStatus === 'success' && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
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
            <TabsTrigger value="production" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Production
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-4">
            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-sage-600 text-center">
                  Analyse en cours... {progress}%
                </p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleTest}
              disabled={isAnalyzing || !messageToTest}
              className="w-full flex items-center gap-2 justify-center"
            >
              <Brain className="h-4 w-4" />
              {isAnalyzing ? 'Analyse en cours...' : 'Lancer la prédiction'}
            </Button>

            <TestMetrics results={testResults} />
            <TestRecommendations recommendations={testResults.recommendations} />
          </TabsContent>

          <TabsContent value="correction" className="space-y-4">
            {validationErrors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Suggestions d'amélioration :</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-yellow-700">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleCorrection}
              className="w-full flex items-center gap-2 justify-center"
            >
              <Wrench className="h-4 w-4" />
              Appliquer les corrections
            </Button>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={isAnalyzing}
              className="w-full flex items-center gap-2 justify-center"
            >
              <TestTube className="h-4 w-4" />
              Tester les corrections
            </Button>
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <Button
              variant="outline"
              onClick={handleProduction}
              className="w-full flex items-center gap-2 justify-center"
            >
              <Rocket className="h-4 w-4" />
              Mettre en production
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};