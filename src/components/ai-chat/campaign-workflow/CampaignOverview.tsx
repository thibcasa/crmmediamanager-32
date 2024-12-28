import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertCircle, AlertTriangle, Rocket } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CampaignOverviewProps {
  creatives: Array<{ url: string; type: string }>;
  content: Array<{ text: string; type: string }>;
  onPredictionClick: () => void;
  onRecommendationClick: (recommendation: string) => void;
  recommendations: string[];
}

export const CampaignOverview = ({
  creatives,
  content,
  onPredictionClick,
  onRecommendationClick,
  recommendations
}: CampaignOverviewProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Aperçu de la campagne</h3>
          <Button 
            onClick={onPredictionClick}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Lancer la prédiction
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Créatives générées</h4>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 gap-4">
                {creatives.map((creative, index) => (
                  <Card key={index} className="p-2">
                    <img 
                      src={creative.url} 
                      alt={`Créative ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <p className="text-sm mt-2 text-center">{creative.type}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Contenu généré</h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {content.map((item, index) => (
                  <Card key={index} className="p-4">
                    <p className="text-sm font-medium mb-1">{item.type}</p>
                    <p className="text-sm">{item.text}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-4">Recommandations et améliorations</h4>
            <div className="grid grid-cols-1 gap-2">
              {recommendations.map((recommendation, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => onRecommendationClick(recommendation)}
                >
                  <div className="flex items-center gap-2">
                    {recommendation.toLowerCase().includes('risque') ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : recommendation.toLowerCase().includes('opportunité') ? (
                      <Rocket className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    )}
                    {recommendation}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};