import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Wand2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export const ContentGenerationModule = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          type: 'social',
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes"
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      
      toast({
        title: "Contenu généré",
        description: "Nouveau contenu créé avec succès",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Génération de Contenu</h3>
          <p className="text-sm text-muted-foreground">
            Créez du contenu personnalisé pour vos campagnes
          </p>
        </div>
        <Button 
          onClick={generateContent}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Wand2 className="w-4 h-4 animate-pulse" />
              Génération...
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4" />
              Générer du contenu
            </>
          )}
        </Button>
      </div>

      <Card className="p-4">
        <Textarea
          value={generatedContent}
          onChange={(e) => setGeneratedContent(e.target.value)}
          placeholder="Le contenu généré apparaîtra ici..."
          className="min-h-[200px]"
        />
      </Card>
    </div>
  );
};