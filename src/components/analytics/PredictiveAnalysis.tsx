import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PredictiveMetrics {
  engagement_rate: number;
  click_through_rate: number;
  conversion_rate: number;
  estimated_reach: number;
}

export const PredictiveAnalysis = ({ campaignId }: { campaignId: string }) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PredictiveMetrics | null>(null);

  const generatePrediction = async () => {
    setIsAnalyzing(true);
    try {
      const { data: campaign } = await supabase
        .from('social_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const response = await supabase.functions.invoke('campaign-analyzer', {
        body: { campaign }
      });

      if (response.error) throw response.error;

      setMetrics(response.data.metrics);
      
      toast({
        title: "Analyse terminée",
        description: "Les prédictions ont été générées avec succès",
      });
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les prédictions",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mockData = [
    { name: 'Lun', value: 400 },
    { name: 'Mar', value: 300 },
    { name: 'Mer', value: 600 },
    { name: 'Jeu', value: 800 },
    { name: 'Ven', value: 700 },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Analyse Prédictive</h3>
          <p className="text-sm text-muted-foreground">
            Estimez les performances de votre campagne avant son lancement
          </p>
        </div>
        <Button 
          onClick={generatePrediction}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 animate-pulse" />
              Analyse en cours...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Générer prédictions
            </>
          )}
        </Button>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-sm font-medium">Taux d'engagement estimé</p>
            <p className="text-2xl font-bold">{(metrics.engagement_rate * 100).toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <p className="text-sm font-medium">Taux de clic estimé</p>
            <p className="text-2xl font-bold">{(metrics.click_through_rate * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};