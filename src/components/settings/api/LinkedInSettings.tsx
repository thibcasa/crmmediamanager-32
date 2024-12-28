import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Linkedin } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

export const LinkedInSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'linkedin', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de LinkedIn ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating LinkedIn API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de LinkedIn.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Configuration LinkedIn</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configurez l'API LinkedIn pour la prospection B2B et le networking.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">Client ID</label>
        <Input
          type="password"
          placeholder="Entrez votre Client ID LinkedIn"
          className="w-full mb-4"
        />
        <label className="block text-sm font-medium mb-1">Client Secret</label>
        <Input
          type="password"
          placeholder="Entrez votre Client Secret LinkedIn"
          className="w-full"
        />
      </div>
      <Button 
        onClick={() => handleSave('test')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Linkedin className="w-4 h-4" />
        Sauvegarder
      </Button>
    </div>
  );
};