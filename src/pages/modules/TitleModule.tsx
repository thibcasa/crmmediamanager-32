import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { TitleForm } from "@/components/title/TitleForm";
import { TitleResults } from "@/components/title/TitleResults";

export default function TitleModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateTitles = async (
    subject: string,
    tone: string,
    targetAudience: string,
    propertyType: string
  ) => {
    try {
      setIsGenerating(true);
      console.log('Generating titles with input:', { subject, tone, targetAudience, propertyType });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_titles',
          subject,
          tone,
          targetAudience,
          propertyType,
          count: 5
        }
      });

      if (error) throw error;
      
      // Store generated titles in history
      await Promise.all(data.titles.map(async (title: string) => {
        await supabase.from('generated_titles').insert({
          user_id: user.id,
          subject,
          generated_title: title,
          metadata: {
            tone,
            targetAudience,
            propertyType
          }
        });
      }));

      setGeneratedTitles(data.titles);
      
      toast({
        title: "Titres générés",
        description: "Vos titres ont été générés avec succès"
      });
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les titres",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTitleSelect = async (title: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await supabase
        .from('generated_titles')
        .update({ status: 'selected' })
        .match({ 
          user_id: user.id,
          generated_title: title 
        });

      toast({
        title: "Titre sélectionné",
        description: "Le titre a été sélectionné avec succès"
      });
    } catch (error) {
      console.error('Error selecting title:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sélectionner le titre",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6 p-4">
      <TitleForm 
        onSubmit={handleGenerateTitles}
        isGenerating={isGenerating}
      />
      
      {generatedTitles.length > 0 && (
        <TitleResults 
          titles={generatedTitles}
          onTitleSelect={handleTitleSelect}
        />
      )}
    </div>
  );
}