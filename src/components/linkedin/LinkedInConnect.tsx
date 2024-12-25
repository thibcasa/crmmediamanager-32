import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Linkedin } from 'lucide-react';

export const LinkedInConnect = () => {
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      console.log('Démarrage de la connexion LinkedIn...');
      
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('URL de redirection:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: redirectUrl,
          scopes: 'openid profile email w_member_social',
          queryParams: {
            prompt: 'consent',
            access_type: 'offline'
          }
        }
      });

      console.log('Réponse de signInWithOAuth:', { data, error });

      if (error) {
        console.error('Erreur de connexion LinkedIn:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message || "Impossible de se connecter à LinkedIn",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.error('Aucune donnée reçue de LinkedIn');
        throw new Error('Aucune donnée reçue de LinkedIn');
      }

      toast({
        title: "Redirection en cours",
        description: "Vous allez être redirigé vers LinkedIn pour l'authentification",
      });

    } catch (error) {
      console.error('Erreur lors de la connexion LinkedIn:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      className="bg-[#0077B5] hover:bg-[#006097] text-white"
    >
      <Linkedin className="mr-2 h-4 w-4" />
      Se connecter avec LinkedIn
    </Button>
  );
};