import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar, Brain } from 'lucide-react';

interface PredictiveAnalysisModuleProps {
  leads: any[];
}

export const PredictiveAnalysisModule = ({ leads }: PredictiveAnalysisModuleProps) => {
  const { toast } = useToast();
  const [isPredicting, setIsPredicting] = useState(false);

  const generatePredictions = async () => {
    setIsPredicting(true);
    try {
      // Logique de prédiction à implémenter
      toast({
        title: "Analyse terminée",
        description: "Prédictions générées avec succès",
      });
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les prédictions",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const data = [
    { name: 'Jan', score: 400 },
    { name: 'Fév', score: 300 },
    { name: 'Mar', score: 600 },
    { name: 'Avr', score: 800 },
    { name: 'Mai', score: 700 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Analyse Prédictive</h3>
          <p className="text-sm text-muted-foreground">
            Prédisez le comportement de vos prospects
          </p>
        </div>
        <Button 
          onClick={generatePredictions}
          disabled={isPredicting}
          className="flex items-center gap-2"
        >
          {isPredicting ? (
            <>
              <Brain className="w-4 h-4 animate-pulse" />
              Analyse en cours...
            </>
          ) : (
            <>
              <ChartBar className="w-4 h-4" />
              Générer prédictions
            </>
          )}
        </Button>
      </div>

      <Card className="p-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};