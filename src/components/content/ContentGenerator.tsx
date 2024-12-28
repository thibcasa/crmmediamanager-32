import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Wand2, Share2, BarChart2 } from 'lucide-react';
import { AIService } from '@/services/AIService';

export const ContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [contentType, setContentType] = useState('post');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating content with prompt:', prompt);
      
      const content = await AIService.generateContent('social', prompt, {
        platform,
        contentType,
        targetAudience: "propriétaires immobiliers Alpes-Maritimes",
        tone: "professionnel et confiant"
      });

      setGeneratedContent(content);
      
      toast({
        title: "Contenu généré",
        description: "Votre contenu a été généré avec succès",
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
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Générateur de Contenu IA</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Plateforme</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une plateforme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Type de contenu</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Publication</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="ad">Publicité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description de votre contenu</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Créer une publication engageante sur l'immobilier à Nice..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            {isGenerating ? 'Génération...' : 'Générer'}
          </Button>
        </div>

        {generatedContent && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Contenu généré</h3>
            <Card className="p-4 bg-muted">
              <pre className="whitespace-pre-wrap">{generatedContent}</pre>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Analyser
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};