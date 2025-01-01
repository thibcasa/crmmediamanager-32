import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ContentGeneratorForm } from './form/ContentGeneratorForm';
import { GeneratedContent } from './display/GeneratedContent';
import { supabase } from "@/lib/supabaseClient";

export const RealEstateContentGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateContent = async (formData: {
    subject: string;
    tone: string;
    audience: string;
    keywords: string;
    contentType: string;
    language: string;
  }) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: { 
          ...formData,
          keywords: formData.keywords.split(',').map(k => k.trim())
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      
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

  const handleRegenerate = () => {
    // Re-trigger content generation with the same parameters
    // This would be implemented if needed
    toast({
      title: "Régénération",
      description: "Cette fonctionnalité sera bientôt disponible",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Générateur de Contenu Immobilier</h1>
        <ContentGeneratorForm 
          onSubmit={handleGenerateContent}
          isGenerating={isGenerating}
        />
        {generatedContent && (
          <GeneratedContent 
            content={generatedContent}
            onRegenerate={handleRegenerate}
          />
        )}
      </Card>
    </div>
  );
};