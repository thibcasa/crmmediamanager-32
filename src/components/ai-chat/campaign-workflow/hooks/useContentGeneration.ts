import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { CampaignData } from '../../types/campaign';

export const useContentGeneration = (
  onContentGenerated: (content: CampaignData['content']) => void,
  existingContent: CampaignData['content']
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<'post' | 'story' | 'reel' | 'article'>('post');
  const [platform, setPlatform] = useState('linkedin');
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
          platform,
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

  return {
    isGenerating,
    contentType,
    setContentType,
    platform,
    setPlatform,
    objective,
    setObjective,
    generateContent
  };
};