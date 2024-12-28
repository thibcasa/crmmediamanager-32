import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram } from 'lucide-react';
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
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Configuration de l'API Instagram</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Configurez votre clé API Instagram pour gérer vos campagnes sociales.
      </p>
      <ApiKeyForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};