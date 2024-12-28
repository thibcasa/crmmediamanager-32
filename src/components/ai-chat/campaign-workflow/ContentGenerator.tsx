import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Loader2 } from 'lucide-react';
import { CampaignData } from '../types/campaign';

interface ContentGeneratorProps {
  onContentGenerated: (content: CampaignData['content']) => void;
  existingContent: CampaignData['content'];
}

export const ContentGenerator = ({ onContentGenerated, existingContent }: ContentGeneratorProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<'post' | 'story' | 'reel' | 'article'>('post');
  const [objective, setObjective] = useState('');

  const generateContent = async () => {
    if (!objective) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire l'objectif de votre contenu.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          type: 'social',
          prompt: objective,
          platform: 'linkedin',
          contentType,
          targetAudience: "propriétaires immobiliers Alpes-Maritimes",
          tone: "professionnel et confiant"
        }
      });

      if (error) throw error;

      const newContent = {
        type: contentType,
        text: data.content
      };

      onContentGenerated([...existingContent, newContent]);

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
          Décrivez l'objectif de votre contenu et choisissez le format
        </p>
      </div>

      <div className="space-y-4">
        <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un type de contenu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="post">Post LinkedIn</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="reel">Reel</SelectItem>
            <SelectItem value="article">Article</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Ex: Promouvoir un webinaire sur l'investissement immobilier..."
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="min-h-[100px]"
        />

        <Button
          onClick={generateContent}
          disabled={isGenerating || !objective}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Générer le contenu
            </>
          )}
        </Button>
      </div>

      {existingContent.length > 0 && (
        <div className="space-y-4">
          {existingContent.map((content, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm font-medium mb-2">
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </p>
              <p className="text-sm whitespace-pre-wrap">{content.text}</p>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
