import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { CampaignData } from '../types/campaign';

interface CreativeGeneratorProps {
  onCreativesGenerated: (creatives: CampaignData['creatives']) => void;
  existingCreatives: CampaignData['creatives'];
}

export const CreativeGenerator = ({ onCreativesGenerated, existingCreatives }: CreativeGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const generateCreatives = async () => {
    if (!prompt) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une description pour générer les créatives.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompt: `Professional real estate photo in Nice, French Riviera. ${prompt}`,
          n: 3,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      if (error) throw error;

      const newCreatives = data.images.map((url: string) => ({
        type: 'image' as const,
        url,
        format: 'linkedin'
      }));

      onCreativesGenerated([...existingCreatives, ...newCreatives]);

      toast({
        title: "Créatives générées",
        description: "Les visuels ont été générés avec succès."
      });
    } catch (error) {
      console.error('Error generating creatives:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les créatives.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Génération de Créatives</h3>
        <p className="text-sm text-muted-foreground">
          Décrivez les visuels souhaités pour votre campagne
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Ex: Une belle villa avec vue mer à Nice..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <Button
          onClick={generateCreatives}
          disabled={isGenerating || !prompt}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer les créatives
            </>
          )}
        </Button>
      </div>

      {existingCreatives.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {existingCreatives.map((creative, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={creative.url}
                alt={`Créative ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
