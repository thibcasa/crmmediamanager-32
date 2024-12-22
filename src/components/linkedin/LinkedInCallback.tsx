import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LinkedInCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const savedState = localStorage.getItem('linkedin_oauth_state');

      if (!code || !state || state !== savedState) {
        setError("Erreur d'authentification");
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        const { error } = await supabase.functions.invoke('linkedin-integration', {
          body: { 
            action: 'exchange-code',
            data: { 
              code,
              userId: user.id
            }
          }
        });

        if (error) throw error;

        // Nettoyer et rediriger
        localStorage.removeItem('linkedin_oauth_state');
        navigate('/ai-chat');
      } catch (err) {
        console.error('Erreur callback LinkedIn:', err);
        setError("Impossible de finaliser la connexion");
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <Card className="p-4 max-w-md mx-auto mt-8">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};