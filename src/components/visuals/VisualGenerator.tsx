import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ContentGenerationService } from "@/components/ai-chat/services/ContentGenerationService";

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
      const result = await ContentGenerationService.createVisual(description, style);
      if (result.image) {
        onImageGenerated(result.image);
        toast({
          title: "Succès",
          description: "Le visuel a été généré avec succès !"
        });
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
          />
        </div>

        <div>
          <label className="text-sm font-medium">Style</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realistic">Réaliste</SelectItem>
              <SelectItem value="modern">Moderne</SelectItem>
              <SelectItem value="minimalist">Minimaliste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerateVisual}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Génération en cours..." : "Générer le visuel"}
        </Button>
      </CardContent>
    </Card>
  );
};