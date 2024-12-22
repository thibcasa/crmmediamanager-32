import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Building2, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sage-50 to-sage-100 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg animate-fadeIn bg-white/95 backdrop-blur">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-sage-600" />
            <h1 className="text-3xl font-bold text-sage-800">ImmoAI</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-sage-700">Bienvenue sur votre CRM Immobilier</h2>
            <p className="text-sage-600">Gérez vos leads et automatisez votre prospection</p>
          </div>
        </div>

        <div className="space-y-6">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#6b736b',
                    brandAccent: '#545b54',
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'w-full flex items-center justify-center gap-2 bg-sage-600 hover:bg-sage-700 text-white',
                input: 'bg-white border-sage-200 focus:border-sage-500',
                label: 'text-sage-700',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                  email_input_placeholder: 'votre@email.com',
                  password_input_placeholder: 'Votre mot de passe',
                },
                sign_up: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  button_label: 'Créer un compte',
                  loading_button_label: 'Création en cours...',
                  email_input_placeholder: 'votre@email.com',
                  password_input_placeholder: 'Choisissez un mot de passe',
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>

        <div className="mt-8 text-center text-sm text-sage-500">
          <p>Optimisez votre prospection immobilière avec l'IA</p>
        </div>
      </Card>
    </div>
  );
}