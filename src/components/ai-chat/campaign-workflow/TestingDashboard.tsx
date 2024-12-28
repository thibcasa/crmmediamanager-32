import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { TestTube, Loader2, AlertCircle } from 'lucide-react';
import { CampaignData } from '../types/campaign';
import { supabase } from '@/lib/supabaseClient';

interface TestingDashboardProps {
  campaignData: CampaignData;
  onTestComplete: (predictions: CampaignData['predictions']) => void;
}

export const TestingDashboard = ({ campaignData, onTestComplete }: TestingDashboardProps) => {
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTest = async () => {
    if (campaignData.creatives.length === 0 || campaignData.content.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer des créatives et du contenu.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('campaign-analyzer', {
        body: {
          content: campaignData.content[0]?.text,
          creatives: campaignData.creatives,
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes"
        }
      });

      clearInterval(interval);
      setProgress(100);

      if (error) throw error;

      const predictions = {
        engagement: data.engagement,
        costPerLead: data.cpa,
        roi: data.roi,
        estimatedLeads: data.predictedMetrics.leadsPerWeek
      };

      onTestComplete(predictions);

      toast({
        title: "Test terminé",
        description: "L'analyse prédictive a été effectuée avec succès."
      });
    } catch (error) {
      console.error('Error testing campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser la campagne.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
      setProgress(0);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Test de la Campagne</h3>
        <p className="text-sm text-muted-foreground">
          Analysez les performances attendues de votre campagne
        </p>
      </div>

      {isTesting && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            Analyse en cours... {progress}%
          </p>
        </div>
      )}

      <Button
        onClick={runTest}
        disabled={isTesting}
        className="w-full"
      >
        {isTesting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Test en cours...
          </>
        ) : (
          <>
            <TestTube className="mr-2 h-4 w-4" />
            Lancer le test
          </>
        )}
      </Button>

      {campaignData.predictions.engagement > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm font-medium">Engagement estimé</p>
            <p className="text-2xl font-bold">
              {(campaignData.predictions.engagement * 100).toFixed(1)}%
            </p>
          </Card>
          
          <Card className="p-4">
            <p className="text-sm font-medium">Coût par lead</p>
            <p className="text-2xl font-bold">
              {campaignData.predictions.costPerLead.toFixed(2)}€
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-medium">ROI estimé</p>
            <p className="text-2xl font-bold">
              {campaignData.predictions.roi.toFixed(1)}x
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm font-medium">Leads estimés</p>
            <p className="text-2xl font-bold">
              {Math.round(campaignData.predictions.estimatedLeads)}
            </p>
          </Card>
        </div>
      )}

      {campaignData.predictions.roi > 0 && campaignData.predictions.roi < 3 && (
        <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <p className="text-sm text-yellow-700">
            Le ROI est inférieur à 3. Des optimisations sont recommandées avant la mise en production.
          </p>
        </div>
      )}
    </Card>
  );
};
