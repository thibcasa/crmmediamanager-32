import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from '@/services/AIService';
import { Users, Brain } from 'lucide-react';

interface SegmentationModuleProps {
  leads: any[];
  isLoading: boolean;
}

export const SegmentationModule = ({ leads, isLoading }: SegmentationModuleProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSegments = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyser ces ${leads.length} contacts immobiliers et suggérer des segments pertinents:
        ${JSON.stringify(leads.map(l => ({
          type: l.qualification,
          score: l.score,
          source: l.source,
          last_contact: l.last_contact_date
        })))}
      `;

      const analysis = await AIService.generateContent('description', prompt);
      
      toast({
        title: "Analyse terminée",
        description: "Nouveaux segments générés avec succès",
      });
    } catch (error) {
      console.error('Error analyzing segments:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'analyser les segments",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Segmentation Intelligente</h3>
          <p className="text-sm text-muted-foreground">
            Analysez et segmentez vos prospects automatiquement
          </p>
        </div>
        <Button 
          onClick={analyzeSegments}
          disabled={isAnalyzing || isLoading}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Brain className="w-4 h-4 animate-pulse" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              Analyser les segments
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <Card key={lead.id} className="p-4">
              <div className="space-y-2">
                <div className="font-medium">
                  {lead.first_name} {lead.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Score: {lead.score}
                </div>
                <div className="text-sm text-muted-foreground">
                  Source: {lead.source}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-muted-foreground">
            {isLoading ? "Chargement..." : "Aucun prospect à analyser"}
          </div>
        )}
      </div>
    </div>
  );
};