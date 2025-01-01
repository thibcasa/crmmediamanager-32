import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, CheckCircle, AlertCircle, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metrics?: {
    engagement: number;
    conversion: number;
    roi: number;
  };
  suggestions?: string[];
}

export const WorkflowOrchestrator = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadWorkflowSteps();
    subscribeToUpdates();
  }, []);

  const loadWorkflowSteps = async () => {
    try {
      const { data: campaigns } = await supabase
        .from('social_campaigns')
        .select('*')
        .eq('status', 'active')
        .single();

      if (campaigns?.optimization_cycles) {
        setSteps(campaigns.optimization_cycles);
      }
    } catch (error) {
      console.error('Error loading workflow steps:', error);
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('workflow-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_campaigns'
        },
        (payload) => {
          if (payload.new?.optimization_cycles) {
            setSteps(payload.new.optimization_cycles);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const analyzePerformance = async (stepId: string) => {
    setIsAnalyzing(true);
    setCurrentStep(stepId);

    try {
      const { data, error } = await supabase.functions.invoke('workflow-analyzer', {
        body: { stepId }
      });

      if (error) throw error;

      // Update steps with analysis results
      setSteps(prev => prev.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'completed',
            metrics: data.metrics,
            suggestions: data.suggestions
          };
        }
        return step;
      }));

      toast({
        title: "Analyse terminée",
        description: "Les recommandations ont été générées avec succès.",
      });
    } catch (error) {
      console.error('Error analyzing performance:', error);
      toast({
        title: "Erreur",
        description: "L'analyse a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {steps.map((step) => (
        <Card key={step.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getStepIcon(step.status)}
              <h3 className="font-medium">{step.name}</h3>
            </div>
            <Badge variant={step.status === 'completed' ? 'default' : 'secondary'}>
              {step.status}
            </Badge>
          </div>

          {step.metrics && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Engagement</p>
                <p className="text-lg font-semibold">{step.metrics.engagement}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion</p>
                <p className="text-lg font-semibold">{step.metrics.conversion}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ROI</p>
                <p className="text-lg font-semibold">{step.metrics.roi}x</p>
              </div>
            </div>
          )}

          {step.suggestions && (
            <div className="space-y-2 mt-4">
              <p className="font-medium">Recommandations :</p>
              <ul className="list-disc pl-5 space-y-1">
                {step.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <Button
              onClick={() => analyzePerformance(step.id)}
              disabled={isAnalyzing && currentStep === step.id}
              className="w-full"
            >
              {isAnalyzing && currentStep === step.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyser les performances
                </>
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};