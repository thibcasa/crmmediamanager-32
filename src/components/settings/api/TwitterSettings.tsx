import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { ApiKeyForm } from '@/components/lead-scraper/ApiKeyForm';

export const TwitterSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'twitter', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de Twitter ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating Twitter API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de Twitter.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApiKeyForm 
      serviceName="Twitter"
      onSave={handleSave}
      isLoading={isLoading}
      placeholder="Entrez votre clé API Twitter"
    />
  );
};