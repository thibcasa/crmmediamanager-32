import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, LinkedinIcon } from "lucide-react";
import { useState } from "react";

export const LinkedInConnect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'auth-url' }
      });

      if (error) throw error;
      
      // Stocker l'état pour la vérification CSRF
      localStorage.setItem('linkedin_oauth_state', data.state);
      
      // Rediriger vers l'URL d'authentification LinkedIn
      window.location.href = data.url;
    } catch (error) {
      console.error('Erreur de connexion LinkedIn:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à LinkedIn pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="w-full flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LinkedinIcon className="h-4 w-4" />
      )}
      Se connecter avec LinkedIn
    </Button>
  );
};