import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/ai-chat');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sage-50">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-900">Connexion</h1>
          <p className="text-sage-600 mt-2">
            Accédez à votre assistant stratégique immobilier
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4F6F52',
                  brandAccent: '#739072',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 bg-sage-600 text-white rounded hover:bg-sage-700',
              input: 'w-full px-3 py-2 border border-sage-200 rounded focus:outline-none focus:ring-2 focus:ring-sage-500',
              label: 'block text-sm font-medium text-sage-700 mb-1',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Votre mot de passe',
              },
              sign_up: {
                email_label: 'Adresse email',
                password_label: 'Mot de passe',
                button_label: 'S\'inscrire',
                loading_button_label: 'Inscription en cours...',
                email_input_placeholder: 'Votre adresse email',
                password_input_placeholder: 'Choisissez un mot de passe',
              },
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;