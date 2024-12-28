import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TestMetrics } from './TestMetrics';
import { TestRecommendations } from './TestRecommendations';
import { ValidationService } from '@/services/ValidationService';
import { Progress } from "@/components/ui/progress";

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<'test' | 'prediction' | 'correction' | 'production'>('test');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [testStatus, setTestStatus] = useState<'pending' | 'warning' | 'success'>('pending');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateProgress = (phase: number) => {
    setProgress(phase * 25); // 4 phases = 25% each
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
          variant: "warning"
        });
      }

      // Phase 2: Correction automatique
      updateProgress(2);
      const correctedPrompt = ValidationService.correctPrompt(messageToTest);
      
      // Phase 3: Analyse des résultats
      updateProgress(3);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        engagement: 85,
        clickRate: 12.5,
        conversionRate: 3.2,
        recommendations: [
          "Ajoutez plus de détails sur la localisation",
          "Précisez le type de bien immobilier",
          "Incluez des informations sur le prix"
        ]
      };

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

        {isAnalyzing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-sage-600 text-center">
              Analyse en cours... {progress}%
            </p>
          </div>
        )}

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

        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={isAnalyzing || activePhase === 'production' || !messageToTest}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isAnalyzing ? 'Analyse en cours...' : 'Lancer le test'}
          </Button>

          {activePhase !== 'test' && (
            <>
              <Button
                variant="outline"
                onClick={() => setActivePhase('correction')}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Passer à la correction
              </Button>

              <TestMetrics />
              <TestRecommendations />
            </>
          )}
        </div>
      </div>
    </Card>
  );
};