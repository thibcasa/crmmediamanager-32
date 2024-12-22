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

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) throw error;
          
          console.log('LinkedIn authentication successful');
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté avec LinkedIn",
          });
          navigate('/ai-chat');
        } else {
          throw new Error('No code parameter found');
        }
      } catch (error) {
        console.error('Error in LinkedIn callback:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la connexion avec LinkedIn",
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