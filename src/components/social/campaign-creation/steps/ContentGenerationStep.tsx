import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ContentGenerationStepProps {
  campaignName: string;
  selectedPlatforms: string[];
  onContentGenerated: (content: any) => void;
}

export const ContentGenerationStep = ({
  campaignName,
  selectedPlatforms,
  onContentGenerated,
}: ContentGenerationStepProps) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [contentType, setContentType] = useState('post');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async () => {
    if (!subject || !selectedPlatforms.length) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs avant de générer le contenu.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: { 
          subject,
          platform: selectedPlatforms[0],
          contentType,
          campaignName
        }
      });

      if (error) throw error;

      onContentGenerated(data);
      
      toast({
        title: "Contenu généré",
        description: "Le contenu a été généré avec succès."
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Génération de Contenu</h3>
        <p className="text-sm text-muted-foreground">
          Définissez le sujet et le type de contenu pour votre campagne
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sujet du contenu</label>
          <Textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Les avantages d'investir dans l'immobilier à Nice en 2024"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Format du contenu</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">Publication</SelectItem>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="article">Article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateContent}
          disabled={isGenerating || !subject || !selectedPlatforms.length}
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
              Générer le contenu optimisé
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};