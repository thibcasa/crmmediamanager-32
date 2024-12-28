import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube } from 'lucide-react';
import { CampaignData } from '../../types/campaign';
import { useTestExecution } from './hooks/useTestExecution';
import { TestProgress } from './components/TestProgress';
import { MetricsGrid } from './components/MetricsGrid';
import { PerformanceAlert } from './components/PerformanceAlert';

interface TestingDashboardProps {
  campaignData: CampaignData;
  onTestComplete: (predictions: CampaignData['predictions']) => void;
}

export const TestingDashboard = ({ campaignData, onTestComplete }: TestingDashboardProps) => {
  const { isTesting, progress, runTest } = useTestExecution(onTestComplete);

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Test de la Campagne</h3>
        <p className="text-sm text-muted-foreground">
          Analysez les performances attendues de votre campagne
        </p>
      </div>

      <TestProgress isTesting={isTesting} progress={progress} />

      <Button
        onClick={() => runTest(campaignData)}
        disabled={isTesting}
        className="w-full"
      >
        <TestTube className="mr-2 h-4 w-4" />
        {isTesting ? 'Test en cours...' : 'Lancer le test'}
      </Button>

      <MetricsGrid predictions={campaignData.predictions} />
      <PerformanceAlert predictions={campaignData.predictions} />
    </Card>
  );
};