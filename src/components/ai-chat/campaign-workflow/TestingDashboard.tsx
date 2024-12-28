import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CampaignData } from '../types/campaign';
import { MetricsGrid } from './testing-dashboard/components/MetricsGrid';
import { TestProgress } from './testing-dashboard/components/TestProgress';
import { PerformanceAlert } from './testing-dashboard/components/PerformanceAlert';
import { useTestExecution } from './testing-dashboard/hooks/useTestExecution';
import { Beaker, AlertCircle } from 'lucide-react';

interface TestingDashboardProps {
  campaignData: CampaignData;
  onTestComplete: (predictions: CampaignData['predictions']) => void;
}

export const TestingDashboard = ({ campaignData, onTestComplete }: TestingDashboardProps) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const { isTesting, progress, runTest } = useTestExecution(onTestComplete);

  const handleSimulation = async () => {
    setIsSimulating(true);
    try {
      // Simulation des métriques de test
      const simulatedResults = {
        engagement: Math.random() * 0.3 + 0.1, // 10-40% engagement
        costPerLead: Math.floor(Math.random() * 30) + 10, // 10-40€ par lead
        roi: Math.random() * 3 + 1, // ROI entre 1x et 4x
        estimatedLeads: Math.floor(Math.random() * 50) + 10 // 10-60 leads estimés
      };

      // Simulation d'une analyse
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Résultats de la simulation:', simulatedResults);
      
      toast({
        title: "Test complété",
        description: "La simulation de la campagne a été effectuée avec succès",
      });

      onTestComplete(simulatedResults);
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la simulation",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRealTest = async () => {
    try {
      await runTest(campaignData);
      
      toast({
        title: "Test réel complété",
        description: "L'analyse de la campagne a été effectuée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors du test:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant le test",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Test & Validation</h3>
          <p className="text-sm text-muted-foreground">
            Testez votre campagne avant le lancement
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleSimulation}
            disabled={isSimulating}
          >
            <Beaker className="mr-2 h-4 w-4" />
            {isSimulating ? 'Simulation...' : 'Simuler'}
          </Button>
          <Button
            onClick={handleRealTest}
            disabled={isTesting}
          >
            {isTesting ? 'Test en cours...' : 'Tester en conditions réelles'}
          </Button>
        </div>
      </div>

      {campaignData.predictions && (
        <div className="space-y-6">
          <MetricsGrid predictions={campaignData.predictions} />
          <TestProgress isTesting={isTesting || isSimulating} progress={progress} />
          <PerformanceAlert predictions={campaignData.predictions} />
          
          {campaignData.predictions.roi < 2 && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p className="text-sm text-yellow-700">
                Le ROI prévu est inférieur à 2. Considérez d'optimiser la campagne avant le lancement.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};