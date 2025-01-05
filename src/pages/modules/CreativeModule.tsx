import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VisualGenerator } from "@/components/visuals/VisualGenerator";
import { VisualChatModifier } from "@/components/visuals/VisualChatModifier";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreativeModule() {
  const [generatedVisuals, setGeneratedVisuals] = useState<Array<{
    id: string;
    image_url: string;
    prompt: string;
    platform: string;
    created_at: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGeneratedVisuals();
  }, []);

  const loadGeneratedVisuals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour voir les visuels générés",
          variant: "destructive"
        });
        return;
      }

      const { data: visuals, error } = await supabase
        .from('generated_visuals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGeneratedVisuals(visuals || []);
    } catch (error) {
      console.error('Error loading visuals:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les visuels générés",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGenerated = async (imageUrl: string, prompt: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: visual, error } = await supabase
        .from('generated_visuals')
        .insert([{
          user_id: user.id,
          image_url: imageUrl,
          prompt: prompt,
          platform: 'linkedin',
          status: 'active',
          metadata: {
            generated_at: new Date().toISOString(),
            source: 'ai_chat'
          }
        }])
        .select()
        .single();

      if (error) throw error;

      setGeneratedVisuals(prev => [visual, ...prev]);
      
      toast({
        title: "Succès",
        description: "Nouveau visuel généré et enregistré"
      });
    } catch (error) {
      console.error('Error saving generated visual:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le visuel généré",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Module Créatif</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <VisualGenerator 
            onImageGenerated={(url) => handleImageGenerated(url, "Investir dans une villa de luxe")}
            subject="Investir dans une villa de luxe" 
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visuels Générés</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : generatedVisuals.length === 0 ? (
              <p className="text-center text-muted-foreground">
                Aucun visuel généré pour le moment
              </p>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {generatedVisuals.map((visual) => (
                    <Card key={visual.id} className="p-4">
                      <img 
                        src={visual.image_url} 
                        alt={visual.prompt}
                        className="w-full h-auto rounded-lg mb-2"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        {visual.prompt}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Généré le {new Date(visual.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}