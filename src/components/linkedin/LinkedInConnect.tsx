import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LinkedIn } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export const LinkedInConnect = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: connection } = await supabase
        .from('linkedin_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      setIsConnected(!!connection);
    } catch (error) {
      console.error('Erreur vérification connexion LinkedIn:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour lier votre compte LinkedIn",
          variant: "destructive",
        });
        return;
      }

      // Rediriger vers l'auth LinkedIn
      const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
      const redirectUri = `${window.location.origin}/linkedin-callback`;
      const scope = 'r_liteprofile w_member_social r_organization_social w_organization_social';
      
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${session.user.id}`;
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur connexion LinkedIn:', error);
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à LinkedIn",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LinkedIn className="h-5 w-5 text-[#0A66C2]" />
        <h3 className="text-lg font-medium">LinkedIn</h3>
      </div>

      <Button
        onClick={handleConnect}
        className="w-full bg-[#0A66C2] hover:bg-[#004182]"
        disabled={isConnected}
      >
        {isConnected ? 'Connecté à LinkedIn' : 'Se connecter à LinkedIn'}
      </Button>
    </div>
  );
};