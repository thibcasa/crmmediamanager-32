import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Share2, Image as ImageIcon } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";

interface GeneratedContent {
  title: string;
  content: string;
  hashtags: string[];
  callToAction: string;
  imageUrl: string;
  suggestedTiming: string;
}

export const RealEstateContentGenerator = () => {
  const [propertyType, setPropertyType] = useState('villa');
  const [location, setLocation] = useState('Nice');
  const [targetAudience, setTargetAudience] = useState('propriétaires');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating content with params:', { propertyType, location, targetAudience });
      
      const { data, error } = await supabase.functions.invoke('real-estate-content-generator', {
        body: { propertyType, location, targetAudience }
      });

      if (error) throw error;

      setGeneratedContent(data);
      
      // Sauvegarder dans la base de données
      const { error: dbError } = await supabase.from('content_templates').insert({
        name: data.title,
        type: 'linkedin_post',
        content: data.content,
        seo_metadata: {
          hashtags: data.hashtags,
          suggestedTiming: data.suggestedTiming
        }
      });

      if (dbError) throw dbError;

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

  const handleShare = async () => {
    if (!generatedContent) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: linkedInData, error: linkedInError } = await supabase
        .from('linkedin_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (linkedInError) throw linkedInError;

      const { error: postError } = await supabase.functions.invoke('linkedin-integration', {
        body: {
          action: 'post',
          data: {
            content: `${generatedContent.title}\n\n${generatedContent.content}\n\n${generatedContent.callToAction}\n\n${generatedContent.hashtags.join(' ')}`,
            imageUrl: generatedContent.imageUrl
          }
        }
      });

      if (postError) throw postError;

      toast({
        title: "Publié sur LinkedIn",
        description: "Votre contenu a été publié avec succès",
      });
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      toast({
        title: "Erreur",
        description: "Impossible de partager sur LinkedIn",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Générateur de Contenu Immobilier</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Type de bien</label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
                <SelectItem value="propriete">Propriété</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Localisation</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nice">Nice</SelectItem>
                <SelectItem value="Cannes">Cannes</SelectItem>
                <SelectItem value="Antibes">Antibes</SelectItem>
                <SelectItem value="Saint-Jean-Cap-Ferrat">Saint-Jean-Cap-Ferrat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cible</label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une cible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="propriétaires">Propriétaires</SelectItem>
                <SelectItem value="investisseurs">Investisseurs</SelectItem>
                <SelectItem value="expatriés">Expatriés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4" />
                Générer
              </>
            )}
          </Button>
        </div>

        {generatedContent && (
          <div className="mt-8">
            <Card className="p-6 bg-muted">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{generatedContent.title}</h3>
                
                {generatedContent.imageUrl && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={generatedContent.imageUrl}
                      alt="Generated property"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{generatedContent.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="font-medium">{generatedContent.callToAction}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Meilleur moment pour poster : {generatedContent.suggestedTiming}
                  </p>
                  <Button
                    onClick={handleShare}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Share2 className="h-4 w-4" />
                    Partager sur LinkedIn
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};