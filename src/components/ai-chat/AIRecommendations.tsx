import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AIRecommendations = () => {
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['campaigns-with-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_campaigns')
        .select('*')
        .not('ai_feedback', 'is', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleApplyRecommendations = async (campaignId: string) => {
    try {
      await supabase.functions.invoke('campaign-analyzer', {
        body: { campaignId, action: 'apply_recommendations' }
      });
    } catch (error) {
      console.error('Error applying recommendations:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-sage-600" />
          <p className="text-sage-600">Chargement des recommandations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des recommandations.
        </AlertDescription>
      </Alert>
    );
  }

  if (!campaigns?.length) {
    return (
      <Card className="p-6 text-center space-y-4">
        <AlertCircle className="h-12 w-12 mx-auto text-sage-400" />
        <h3 className="text-lg font-semibold text-sage-700">Aucune recommandation</h3>
        <p className="text-sage-600">
          Lancez une campagne pour obtenir des recommandations de l'IA.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-lg font-semibold">Recommandations de l'IA</h3>
      
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{campaign.name}</h4>
                <Badge 
                  variant={
                    campaign.ai_feedback.performance_status === 'good' 
                      ? 'default'
                      : campaign.ai_feedback.performance_status === 'average'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className={
                    campaign.ai_feedback.performance_status === 'good'
                      ? 'bg-green-500 hover:bg-green-600'
                      : campaign.ai_feedback.performance_status === 'average'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : undefined
                  }
                >
                  {campaign.ai_feedback.performance_status === 'good' && <ThumbsUp className="w-4 h-4 mr-1" />}
                  {campaign.ai_feedback.performance_status === 'needs_improvement' && <ThumbsDown className="w-4 h-4 mr-1" />}
                  {campaign.ai_feedback.performance_status}
                </Badge>
              </div>

              <div className="text-sm space-y-2">
                <p><strong>Sentiment:</strong> {(campaign.ai_feedback.metrics.avg_sentiment * 100).toFixed(1)}%</p>
                <p><strong>Engagement:</strong> {(campaign.ai_feedback.metrics.avg_engagement * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-sage-50 p-3 rounded-md text-sm">
                <p className="font-medium mb-2">Recommandations:</p>
                <p className="whitespace-pre-wrap text-sage-700">{campaign.ai_feedback.recommendations}</p>
              </div>

              <Button 
                onClick={() => handleApplyRecommendations(campaign.id)}
                className="w-full bg-sage-600 hover:bg-sage-700 text-white"
              >
                Appliquer les recommandations
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};