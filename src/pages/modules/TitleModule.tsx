import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { TitleForm } from "@/components/title/TitleForm";
import { TitleResults } from "@/components/title/TitleResults";
import { TitleOptimizationService } from "@/services/ai/TitleOptimizationService";

export default function TitleModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const { toast } = useToast();
  const optimizationService = new TitleOptimizationService();

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

      // Generate optimized titles
      const titles = await optimizationService.optimizeTitle(subject, tone, targetAudience);
      
      // Analyze performance for each title
      const titlesWithAnalysis = await Promise.all(
        titles.map(async (title) => {
          const analysis = await optimizationService.analyzeTitlePerformance(title);
          return { title, analysis };
        })
      );

      // Store generated titles in history
      await Promise.all(titlesWithAnalysis.map(async ({ title, analysis }) => {
        await supabase.from('generated_titles').insert({
          user_id: user.id,
          subject,
          generated_title: title,
          seo_score: analysis.seoScore,
          engagement_score: Math.round(analysis.engagementPrediction * 100),
          metadata: {
            tone,
            targetAudience,
            propertyType,
            analysis: analysis.suggestions
          }
        });
      }));

      setGeneratedTitles(titles);
      
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