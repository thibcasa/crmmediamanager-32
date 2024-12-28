import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { ApiKeyForm } from '@/components/lead-scraper/ApiKeyForm';

export const FacebookSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'facebook', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de Facebook ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating Facebook API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de Facebook.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApiKeyForm 
      serviceName="Facebook"
      onSave={handleSave}
      isLoading={isLoading}
      placeholder="Entrez votre clé API Facebook"
    />
  );
};