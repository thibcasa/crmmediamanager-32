import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Événement d'authentification:", event);
      if (event === 'SIGNED_IN' && session) {
        console.log("Session utilisateur:", session);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate('/');
      }
    });

    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log("Vérification de l'utilisateur:", user);
      if (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
        return;
      }
      if (user) {
        navigate('/');
      }
    };
    
    checkUser();
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50 p-4">
      <Card className="w-full max-w-md p-8 bg-white">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-sage-900">
            Connexion
          </h1>
          <p className="text-sage-600 mt-2">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#65736E',
                  brandAccent: '#52665D',
                },
              },
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                link_text: 'Vous avez déjà un compte ? Connectez-vous',
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours...',
                link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
              },
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Login;