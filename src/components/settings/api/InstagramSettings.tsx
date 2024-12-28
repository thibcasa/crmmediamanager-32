import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

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
      <h3 className="text-lg font-medium mb-2">Configuration Instagram</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configurez l'API Instagram pour gérer votre présence visuelle et vos stories.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">Access Token</label>
        <Input
          type="password"
          placeholder="Entrez votre Access Token Instagram"
          className="w-full"
        />
      </div>
      <Button 
        onClick={() => handleSave('test')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Instagram className="w-4 h-4" />
        Sauvegarder
      </Button>
    </div>
  );
};