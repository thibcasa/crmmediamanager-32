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
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        const error_description = url.searchParams.get('error_description');

        if (error || error_description) {
          console.error('LinkedIn auth error:', error, error_description);
          throw new Error(error_description || 'Erreur de connexion LinkedIn');
        }

        if (!code) {
          throw new Error('Code d\'autorisation manquant');
        }

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('Exchange code error:', exchangeError);
          throw exchangeError;
        }

        if (!data.session) {
          throw new Error('Session non créée');
        }
        
        console.log('LinkedIn authentication successful');
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté avec LinkedIn",
        });
        navigate('/ai-chat');
      } catch (error) {
        console.error('Error in LinkedIn callback:', error);
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