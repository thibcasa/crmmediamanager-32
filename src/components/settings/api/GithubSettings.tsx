import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

export const GithubSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-social-api-key', {
        body: { platform: 'github', key }
      });

      if (error) throw error;

      toast({
        title: "Configuration mise à jour",
        description: "Les paramètres de GitHub ont été mis à jour avec succès."
      });
    } catch (error) {
      console.error('Error updating GitHub API key:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la configuration de GitHub.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Configuration GitHub</h3>
      <p className="text-sm text-gray-500 mb-4">
        Configurez l'API GitHub pour gérer vos repositories et workflows.
      </p>
      <div>
        <label className="block text-sm font-medium mb-1">Personal Access Token</label>
        <Input
          type="password"
          placeholder="Entrez votre Personal Access Token GitHub"
          className="w-full"
        />
      </div>
      <Button 
        onClick={() => handleSave('test')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Github className="w-4 h-4" />
        Sauvegarder
      </Button>
    </div>
  );
};