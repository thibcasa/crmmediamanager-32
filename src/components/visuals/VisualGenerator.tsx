import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface VisualGeneratorProps {
  subject: string;
  onImageGenerated: (url: string) => void;
}

export const VisualGenerator = ({ subject, onImageGenerated }: VisualGeneratorProps) => {
  const [description, setDescription] = useState(subject);
  const [style, setStyle] = useState("realistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateVisual = async () => {
    if (!description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompt: `Professional real estate photo: ${description}. Style: ${style}, high-end property in French Riviera`,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      if (error) throw error;

      if (data.images && data.images[0]) {
        onImageGenerated(data.images[0]);
        toast({
          title: "Succès",
          description: "Le visuel a été généré avec succès !"
        });
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error('Error generating visual:', error);
      toast({
        title: "Erreur",
        description: "La génération a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de Visuels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Villa de luxe avec piscine à Nice..."
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Style</label>
          <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Réaliste</SelectItem>
              <SelectItem value="modern">Moderne</SelectItem>
              <SelectItem value="minimalist">Minimaliste</SelectItem>
              <SelectItem value="luxury">Luxueux</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateVisual}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            "Générer le visuel"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};