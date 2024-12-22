import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const LinkedInCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Traitement du callback LinkedIn...');
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        const error_description = url.searchParams.get('error_description');

        console.log('Paramètres URL:', {
          code: code ? 'présent' : 'absent',
          error,
          error_description
        });

        if (error || error_description) {
          console.error('Erreur d\'authentification LinkedIn:', error, error_description);
          throw new Error(error_description || 'Erreur de connexion LinkedIn');
        }

        if (!code) {
          console.error('Code d\'autorisation manquant');
          throw new Error('Code d\'autorisation manquant');
        }

        console.log('Échange du code contre une session...');
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        console.log('Réponse de exchangeCodeForSession:', {
          success: !!data.session,
          error: exchangeError
        });

        if (exchangeError) {
          console.error('Erreur d\'échange de code:', exchangeError);
          throw exchangeError;
        }

        if (!data.session) {
          console.error('Session non créée');
          throw new Error('Session non créée');
        }
        
        console.log('Authentification LinkedIn réussie');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté avec LinkedIn",
        });
        navigate('/ai-chat');
      } catch (error) {
        console.error('Erreur dans le callback LinkedIn:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message || "Une erreur est survenue lors de la connexion avec LinkedIn",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage-500" />
    </div>
  );
};