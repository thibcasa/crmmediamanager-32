import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LinkedinIcon, Loader2, CheckCircle, XCircle } from "lucide-react";

export const LinkedInStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: connection, error } = await supabase
        .from('linkedin_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setIsConnected(!!connection);
    } catch (error) {
      console.error('Error checking LinkedIn connection:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier la connexion LinkedIn.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'auth-url' }
      });

      if (error) throw error;
      
      // Store state for CSRF verification
      localStorage.setItem('linkedin_oauth_state', data.state);
      
      // Redirect to LinkedIn auth
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

  const handleDisconnect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('linkedin_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setIsConnected(false);
      toast({
        title: "Déconnecté",
        description: "Votre compte LinkedIn a été déconnecté.",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter le compte LinkedIn.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Vérification de la connexion...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-green-50">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Connecté à LinkedIn</span>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDisconnect}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Déconnecter
        </Button>
      </div>
    );
  }

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