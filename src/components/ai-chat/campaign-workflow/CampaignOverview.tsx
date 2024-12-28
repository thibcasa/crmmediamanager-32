import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Wand2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aperçu de la Campagne</h3>
        <Button 
          onClick={onPredictionClick}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          Lancer la Prédiction
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-4">Créatives</h4>
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-4">
              {creatives.map((creative, index) => (
                <Card key={index} className="p-2">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <img
                      src={creative.url}
                      alt={`Créative ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        toast({
                          title: "Aperçu",
                          description: "Fonctionnalité d'aperçu à venir"
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm mt-2 text-center">{creative.type}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-4">Contenu</h4>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {content.map((item, index) => (
                <Card key={index} className="p-4">
                  <p className="text-sm font-medium mb-2">{item.type}</p>
                  <p className="text-sm whitespace-pre-wrap">{item.text}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Recommandations</h4>
        <div className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between"
              onClick={() => onRecommendationClick(recommendation)}
            >
              {recommendation}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};