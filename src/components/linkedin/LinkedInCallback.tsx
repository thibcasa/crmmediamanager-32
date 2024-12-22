import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const LinkedInCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      console.log("Starting LinkedIn callback handling");
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const savedState = localStorage.getItem('linkedin_oauth_state');

      console.log("LinkedIn callback parameters:", {
        hasCode: !!code,
        state,
        savedState,
        currentUrl: window.location.href
      });

      if (!code) {
        const errorMessage = "Code d'autorisation LinkedIn manquant";
        console.error(errorMessage);
        setError(errorMessage);
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (!state || state !== savedState) {
        const errorMessage = "État de sécurité LinkedIn invalide";
        console.error(errorMessage, { receivedState: state, savedState });
        setError(errorMessage);
        toast({
          title: "Erreur de sécurité",
          description: "Validation de l'état LinkedIn échouée",
          variant: "destructive"
        });
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Utilisateur non authentifié");
        }

        const redirectUri = `${window.location.origin}/auth/callback`;
        console.log("Using redirect URI for token exchange:", redirectUri);

        const { data, error: exchangeError } = await supabase.functions.invoke('linkedin-integration', {
          body: { 
            action: 'exchange-code',
            data: { 
              code,
              userId: user.id,
              redirectUri
            }
          }
        });

        if (exchangeError) {
          console.error("LinkedIn token exchange error:", exchangeError);
          throw exchangeError;
        }

        console.log("LinkedIn connection successful:", data);
        toast({
          title: "Connexion réussie",
          description: "Votre compte LinkedIn est maintenant connecté",
        });

        // Clean up
        localStorage.removeItem('linkedin_oauth_state');
        
        // Redirect back to the main page
        navigate('/ai-chat');
      } catch (err) {
        console.error('Erreur callback LinkedIn:', err);
        setError("Impossible de finaliser la connexion LinkedIn");
        toast({
          title: "Erreur de connexion",
          description: "Impossible de finaliser la connexion LinkedIn. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    };

    handleCallback();
  }, [navigate, toast]);

  if (error) {
    return (
      <Card className="p-6 max-w-md mx-auto mt-8">
        <p className="text-red-500 text-center">{error}</p>
        <button 
          onClick={() => navigate('/ai-chat')}
          className="mt-4 w-full bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700"
        >
          Retour
        </button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="p-6 w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
          <p className="text-sage-700 text-center">
            Connexion à LinkedIn en cours...
          </p>
        </div>
      </Card>
    </div>
  );
};