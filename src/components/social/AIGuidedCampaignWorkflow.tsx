import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Brain, Target, BarChart2, Rocket, Settings } from 'lucide-react';
import { PredictiveAnalysis } from "@/components/analytics/PredictiveAnalysis";
import { TestCellPreview } from "@/components/test-cell/TestCellPreview";
import { WorkflowPreview } from "@/components/test-cell/WorkflowPreview";
import { MetricsPreview } from "@/components/test-cell/MetricsPreview";
import { Platform } from '@/services/SocialCampaignService';

interface AIRecommendation {
  platform: Platform;
  score: number;
  reason: string;
  suggestedContent: string;
  predictedMetrics: {
    engagement: number;
    reach: number;
    conversion: number;
  };
}

export const AIGuidedCampaignWorkflow = () => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<string>('analysis');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePlatformSelect = async (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('campaign-analyzer', {
        body: { 
          platform,
          targetAudience: "Propriétaires immobiliers Alpes-Maritimes",
          marketContext: {
            region: "Alpes-Maritimes",
            propertyTypes: ["Appartement", "Villa", "Maison"],
            priceRange: { min: 300000, max: 1500000 },
            marketConditions: "stable"
          }
        }
      });

      if (error) throw error;

      setRecommendations(data.recommendations);
      toast({
        title: "Analyse terminée",
        description: "Recommandations générées avec succès",
      });
    } catch (error) {
      console.error('Error analyzing campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les recommandations",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Campagne IA-Guidée</h2>
            <p className="text-muted-foreground mt-1">
              Optimisez votre stratégie avec l'analyse prédictive
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handlePlatformSelect(selectedPlatform)}
              disabled={isAnalyzing}
            >
              <Brain className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
            </Button>
          </div>
        </div>

        <Tabs value={activePhase} onValueChange={setActivePhase}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Analyse IA
            </TabsTrigger>
            <TabsTrigger value="targeting" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Ciblage
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Test & Validation
            </TabsTrigger>
            <TabsTrigger value="launch" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Lancement
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <PredictiveAnalysis campaignId={selectedPlatform} />
              
              {recommendations.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4">Recommandations IA</h3>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{rec.platform}</h4>
                          <span className="text-sm text-muted-foreground">
                            Score: {rec.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{rec.reason}</p>
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Engagement prévu</p>
                            <p className="text-2xl">{(rec.predictedMetrics.engagement * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Portée estimée</p>
                            <p className="text-2xl">{rec.predictedMetrics.reach.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Conversion</p>
                            <p className="text-2xl">{(rec.predictedMetrics.conversion * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="targeting">
            <TestCellPreview />
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-6">
              <WorkflowPreview />
              <MetricsPreview />
            </div>
          </TabsContent>

          <TabsContent value="launch">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <Rocket className="h-12 w-12 mx-auto text-primary" />
                <h3 className="text-xl font-medium">Prêt à lancer</h3>
                <p className="text-muted-foreground">
                  Votre campagne a été optimisée et est prête à être lancée
                </p>
                <Button className="mt-4">
                  <Rocket className="mr-2 h-4 w-4" />
                  Lancer la campagne
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};