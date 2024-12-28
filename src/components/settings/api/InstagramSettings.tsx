import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { ApiKeyForm } from '@/components/lead-scraper/ApiKeyForm';

export const InstagramSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'instagram', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres d'Instagram ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating Instagram API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration d'Instagram.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApiKeyForm 
      serviceName="Instagram"
      onSave={handleSave}
      isLoading={isLoading}
      placeholder="Entrez votre clé API Instagram"
    />
  );
};