import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

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
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Configuration Twitter</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configurez l'API Twitter pour automatiser vos publications et analyses.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <Input
            type="password"
            placeholder="Entrez votre API Key Twitter"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">API Secret Key</label>
          <Input
            type="password"
            placeholder="Entrez votre API Secret Key Twitter"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bearer Token</label>
          <Input
            type="password"
            placeholder="Entrez votre Bearer Token Twitter"
            className="w-full"
          />
        </div>
        <Button 
          onClick={() => handleSave('test')}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Twitter className="w-4 h-4" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};