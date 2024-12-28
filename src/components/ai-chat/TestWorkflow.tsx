import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Play, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TestResults } from './types/test-results';
import { TestMetrics } from './TestMetrics';
import { TestRecommendations } from './TestRecommendations';

interface TestWorkflowProps {
  messageToTest?: string;
}

export const TestWorkflow = ({ messageToTest }: TestWorkflowProps) => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<'test' | 'prediction' | 'correction' | 'production'>('test');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [testStatus, setTestStatus] = useState<'pending' | 'warning' | 'success'>('pending');

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
    try {
      // Simulation du test avec le message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = {
        engagement: 0.15,
        clickRate: 0.08,
        conversionRate: 0.03,
        recommendations: [
          "Ajuster le ton pour le marché premium des Alpes-Maritimes",
          "Ajouter plus de visuels de propriétés de luxe",
          "Renforcer l'appel à l'action avec des éléments locaux"
        ]
      };

      setTestResults(results);
      setTestStatus(results.engagement > 0.2 ? 'success' : 'warning');
      setActivePhase('prediction');
      
      toast({
        title: "Test terminé",
        description: "Les résultats de test sont disponibles",
      });
    } catch (error) {
      console.error('Error running test:', error);
      toast({
        title: "Erreur",
        description: "Impossible de compléter le test",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeploy = () => {
    if (testStatus !== 'success') {
      toast({
        title: "Action impossible",
        description: "Veuillez corriger les problèmes avant de déployer",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Campagne déployée",
      description: "Votre campagne a été mise en production avec succès"
    });
    setActivePhase('production');
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Workflow de Test</h3>
          <p className="text-sm text-muted-foreground">
            Testez et validez votre campagne avant son lancement
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={isAnalyzing || activePhase === 'production' || !messageToTest}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isAnalyzing ? 'Analyse...' : 'Lancer le test'}
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={testStatus !== 'success' || activePhase === 'production'}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Déployer
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
        {['test', 'prediction', 'correction', 'production'].map((phase, index) => (
          <div key={phase} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              activePhase === phase 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1}
            </div>
            <span className="ml-2 text-sm font-medium">
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </span>
            {index < 3 && (
              <div className="mx-2 h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      {testResults && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {testStatus === 'pending' && (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            {testStatus === 'warning' && (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            {testStatus === 'success' && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <span>
              {testStatus === 'pending' && "En attente de test"}
              {testStatus === 'warning' && "Ajustements recommandés"}
              {testStatus === 'success' && "Tests validés"}
            </span>
          </div>

          <TestMetrics results={testResults} />
          <TestRecommendations recommendations={testResults.recommendations} />
        </div>
      )}
    </Card>
  );
};