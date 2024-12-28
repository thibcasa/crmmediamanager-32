import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { CampaignData } from '../types/campaign';
import { CreativeForm } from './creative-generator/CreativeForm';
import { CreativeGallery } from './creative-generator/CreativeGallery';

interface CreativeGeneratorProps {
  onCreativesGenerated: (creatives: CampaignData['creatives']) => void;
  existingCreatives: CampaignData['creatives'];
}

export const CreativeGenerator = ({ onCreativesGenerated, existingCreatives }: CreativeGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCreatives = async (prompt: string) => {
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

      <CreativeForm 
        onSubmit={generateCreatives}
        isGenerating={isGenerating}
      />

      <CreativeGallery creatives={existingCreatives} />
    </Card>
  );
};