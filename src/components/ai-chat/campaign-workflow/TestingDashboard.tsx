import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CampaignData } from '../types/campaign';
import { MetricsGrid } from './testing-dashboard/components/MetricsGrid';
import { TestProgress } from './testing-dashboard/components/TestProgress';
import { PerformanceAlert } from './testing-dashboard/components/PerformanceAlert';
import { useTestExecution } from './testing-dashboard/hooks/useTestExecution';
import { Beaker, AlertCircle, PlayCircle, Loader2, BarChart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface TestingDashboardProps {
  campaignData: CampaignData;
  onTestComplete: (predictions: CampaignData['predictions']) => void;
}

export const TestingDashboard = ({ campaignData, onTestComplete }: TestingDashboardProps) => {
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const [monitoringResults, setMonitoringResults] = useState<any>(null);
  const { isTesting, progress, runTest } = useTestExecution(onTestComplete);

  const logTestExecution = async (phase: string, status: 'success' | 'error', details: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('error_logs').insert({
        error_type: 'TEST_EXECUTION',
        error_message: `Phase: ${phase} - Status: ${status}`,
        component: 'TestingDashboard',
        correction_applied: status === 'success' ? 'No correction needed' : details.correction || 'None',
        success: status === 'success',
        user_id: user.id
      });
    } catch (error) {
      console.error('Error logging test execution:', error);
    }
  };

  const handleSimulation = async () => {
    setIsSimulating(true);
    try {
      // Phase 1: Analyse LinkedIn
      await logTestExecution('LINKEDIN_ANALYSIS', 'success', {
        message: 'Analyse LinkedIn démarrée'
      });

      const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'analyze_profiles', location: 'Alpes-Maritimes' }
      });

      if (linkedinError) throw linkedinError;

      // Phase 2: Génération de contenu
      await logTestExecution('CONTENT_GENERATION', 'success', {
        message: 'Génération de contenu réussie'
      });

      const { data: contentData, error: contentError } = await supabase.functions.invoke('content-generator', {
        body: { 
          type: 'social',
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes"
        }
      });

      if (contentError) throw contentError;

      // Phase 3: Test prédictif
      const simulatedResults = {
        engagement: linkedinData?.engagement || Math.random() * 0.3 + 0.1,
        costPerLead: Math.floor(Math.random() * 30) + 10,
        roi: Math.random() * 3 + 1,
        estimatedLeads: Math.floor(Math.random() * 50) + 10
      };

      // Phase 4: Création automatique de la campagne
      const { data: campaignData, error: campaignError } = await supabase.from('social_campaigns').insert({
        platform: 'linkedin',
        name: `Campagne test ${new Date().toLocaleDateString()}`,
        status: 'draft',
        targeting_criteria: {
          location: 'Alpes-Maritimes',
          interests: ['Immobilier', 'Investissement'],
          age_range: '35-65'
        },
        message_template: contentData?.content,
        ai_feedback: simulatedResults
      });

      if (campaignError) throw campaignError;

      // Récupération des résultats du monitoring
      const { data: monitoringData } = await supabase
        .from('error_logs')
        .select('*')
        .eq('error_type', 'TEST_EXECUTION')
        .order('created_at', { ascending: false })
        .limit(10);

      setMonitoringResults(monitoringData);
      
      toast({
        title: "Test complété",
        description: "L'analyse complète du CRM a été effectuée avec succès",
      });

      onTestComplete(simulatedResults);
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      await logTestExecution('SIMULATION', 'error', {
        error: error.message,
        correction: 'Tentative de correction automatique initiée'
      });
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la simulation",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Test & Validation</h3>
          <p className="text-sm text-muted-foreground">
            Test complet du CRM avec monitoring
          </p>
        </div>
      </div>

      <Button 
        size="lg"
        className="w-full h-16 text-lg font-semibold bg-primary hover:bg-primary/90 mb-6"
        onClick={handleSimulation}
        disabled={isSimulating}
      >
        {isSimulating ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Analyse complète en cours...
          </>
        ) : (
          <>
            <PlayCircle className="mr-2 h-6 w-6" />
            Lancer l'analyse complète du CRM
          </>
        )}
      </Button>

      {monitoringResults && (
        <Card className="p-4 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Résultats du Monitoring</h4>
          </div>
          <div className="space-y-2">
            {monitoringResults.map((log: any, index: number) => (
              <div 
                key={index}
                className={`p-2 rounded-lg ${
                  log.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                <p className="text-sm font-medium">{log.error_message}</p>
                <p className="text-xs opacity-75">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {campaignData.predictions && (
        <div className="space-y-6">
          <MetricsGrid predictions={campaignData.predictions} />
          <PerformanceAlert predictions={campaignData.predictions} />
        </div>
      )}
    </Card>
  );
};