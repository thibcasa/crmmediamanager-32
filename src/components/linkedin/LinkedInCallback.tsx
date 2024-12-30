import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

export const LinkedInCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (!code || !state) {
        throw new Error('Code ou state manquant dans la réponse LinkedIn');
      }

      // Échanger le code contre un token
      const { data, error } = await supabase.functions.invoke('linkedin-auth', {
        body: { code, state }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre compte LinkedIn a été connecté avec succès",
      });

      // Rediriger vers la page principale
      navigate('/');
    } catch (error) {
      console.error('Erreur callback LinkedIn:', error);
      setError('Impossible de connecter votre compte LinkedIn');
      toast({
        title: "Erreur",
        description: "Impossible de connecter votre compte LinkedIn",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p>Connexion à LinkedIn en cours...</p>
    </div>
  );
};