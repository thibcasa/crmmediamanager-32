import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertCircle, Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Campaign {
  id: string;
  optimization_cycles?: {
    id: string;
    status: string;
    metrics?: {
      engagement: number;
      conversion: number;
      roi: number;
    };
    suggestions?: string[];
  }[];
}

export const WorkflowOrchestrator = () => {
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const { data, error } = await supabase
          .from('social_campaigns')
          .select('*')
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Aucune campagne active",
            description: "Créez une nouvelle campagne pour commencer",
            variant: "destructive"
          });
          return;
        }

        setCampaign(data as Campaign);
      } catch (error) {
        console.error('Error loading campaign:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la campagne",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [toast]);

  const getModuleIcon = (status: string) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 0.8) return 'text-green-500';
    if (value >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">
          Aucune campagne active trouvée
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Workflow d'Optimisation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaign.optimization_cycles?.map((cycle, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getModuleIcon(cycle.status)}
                <h3 className="font-medium">Cycle {index + 1}</h3>
              </div>
              <Badge variant={cycle.status === 'validated' ? 'default' : 'secondary'}>
                {cycle.status}
              </Badge>
            </div>

            {cycle.metrics && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Engagement</div>
                  <div className={`text-sm font-medium ${getMetricColor(cycle.metrics.engagement)}`}>
                    {(cycle.metrics.engagement * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Conversion</div>
                  <div className={`text-sm font-medium ${getMetricColor(cycle.metrics.conversion)}`}>
                    {(cycle.metrics.conversion * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">ROI</div>
                  <div className={`text-sm font-medium ${getMetricColor(cycle.metrics.roi)}`}>
                    {cycle.metrics.roi.toFixed(1)}x
                  </div>
                </div>
              </div>
            )}

            {cycle.suggestions && cycle.suggestions.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Suggestions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {cycle.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};