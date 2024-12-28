import { useEffect } from 'react';
import { TestProgress } from './components/TestProgress';
import { MetricsGrid } from './components/MetricsGrid';
import { PerformanceAlert } from './components/PerformanceAlert';
import { useTestExecution } from './hooks/useTestExecution';
import { CampaignData } from '../../types/campaign';
import { ConfigurationService } from '@/services/ConfigurationService';
import { useToast } from '@/components/ui/use-toast';

interface TestingDashboardProps {
  campaignData: CampaignData;
  onTestComplete: (predictions: CampaignData['predictions']) => void;
}

export const TestingDashboard = ({ campaignData, onTestComplete }: TestingDashboardProps) => {
  const { toast } = useToast();
  const { isTesting, progress, runTest } = useTestExecution(onTestComplete);

  useEffect(() => {
    const backupConfiguration = async () => {
      try {
        await ConfigurationService.saveConfiguration(
          'testing_interface',
          {
            components: {
              testProgress: true,
              metricsGrid: true,
              performanceAlert: true
            },
            layout: 'default',
            metrics: [
              'engagement',
              'costPerLead',
              'roi',
              'estimatedLeads'
            ]
          },
          'Initial testing interface configuration backup'
        );
        
        toast({
          title: "Configuration sauvegardée",
          description: "La configuration de l'interface de test a été sauvegardée avec succès."
        });
      } catch (error) {
        console.error('Error backing up configuration:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder la configuration.",
          variant: "destructive"
        });
      }
    };

    backupConfiguration();
  }, [toast]);

  return (
    <div className="space-y-6">
      <TestProgress isTesting={isTesting} progress={progress} />
      <MetricsGrid predictions={campaignData.predictions} />
      <PerformanceAlert predictions={campaignData.predictions} />
      
      <button
        onClick={() => runTest(campaignData)}
        disabled={isTesting}
        className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isTesting ? 'Test en cours...' : 'Lancer le test'}
      </button>
    </div>
  );
};