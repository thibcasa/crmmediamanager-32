import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, ImagePlus, Edit2, Trash2, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Creative {
  id: string;
  url: string;
  performance?: number;
  metadata?: {
    platform: string;
    format: string;
  };
}

export const CreativesModule = () => {
  const { toast } = useToast();
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewCreative = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompt: `Professional real estate photo in Nice, French Riviera. ${prompt}`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      if (error) throw error;

      const newCreative: Creative = {
        id: crypto.randomUUID(),
        url: data.images[0],
        metadata: {
          platform: 'linkedin',
          format: 'post'
        }
      };

      setCreatives([...creatives, newCreative]);
      
      toast({
        title: "Créative générée",
        description: "Nouvelle créative ajoutée avec succès"
      });
    } catch (error) {
      console.error('Error generating creative:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la créative",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteCreative = (id: string) => {
    setCreatives(creatives.filter(creative => creative.id !== id));
    toast({
      title: "Créative supprimée",
      description: "La créative a été supprimée avec succès"
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Module Créatives</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos visuels pour la campagne
          </p>
        </div>
        <Button
          onClick={() => generateNewCreative("Luxury villa with sea view")}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            "Génération..."
          ) : (
            <>
              <ImagePlus className="h-4 w-4" />
              Nouvelle Créative
            </>
          )}
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-4">
          {creatives.map((creative) => (
            <Card key={creative.id} className="p-4 space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={creative.url}
                  alt="Créative"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteCreative(creative.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Format: {creative.metadata?.format}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {creative.metadata?.platform}
                  </span>
                </div>
                {creative.performance && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-sage-100 rounded-full">
                      <div
                        className="h-full bg-sage-500 rounded-full"
                        style={{ width: `${creative.performance * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-sage-600">
                      {(creative.performance * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};