import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

export const TumblrSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'tumblr', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de Tumblr ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating Tumblr API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de Tumblr.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Configuration Tumblr</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configurez l'API Tumblr pour gérer vos blogs et posts.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">API Key</label>
        <Input
          type="password"
          placeholder="Entrez votre API Key Tumblr"
          className="w-full"
        />
      </div>
      <Button 
        onClick={() => handleSave('test')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4" />
        Sauvegarder
      </Button>
    </div>
  );
};