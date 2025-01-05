import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ContentAnalyzer, ContentAnalysis } from '@/services/ai/ContentAnalyzer';
import { Wand2, BarChart2, Send } from 'lucide-react';

export const ContentCreationStudio = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const analyzer = new ContentAnalyzer();

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    
    if (newContent.length > 50) {
      setIsAnalyzing(true);
      try {
        const contentAnalysis = await analyzer.analyzeContent(newContent);
        setAnalysis(contentAnalysis);
      } catch (error) {
        console.error('Analysis error:', error);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Studio de Création</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleContentChange(content)}
          disabled={isAnalyzing}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Analyser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Rédigez votre contenu ici..."
            className="min-h-[200px]"
          />
          <Button className="w-full">
            <Send className="w-4 h-4 mr-2" />
            Publier
          </Button>
        </div>

        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Analyse en cours...</div>
            <Progress value={45} />
          </div>
        ) : analysis ? (
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              <h3 className="font-medium">Analyse en temps réel</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(analysis.sentiment * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Sentiment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(analysis.predictedEngagement * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Engagement prévu</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(analysis.audienceMatch * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Match audience</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recommandations</h4>
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="text-sm p-2 bg-muted rounded-lg">
                  {rec.message}
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </Card>
  );
};