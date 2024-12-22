import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Building2, Sparkles, Key, Mail } from 'lucide-react';

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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-sage-100 to-sage-200 animate-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-sage-300 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-sage-400 rounded-full blur-xl animate-pulse delay-300" />
      </div>

      <Card className="relative w-full max-w-md p-8 shadow-xl animate-fadeIn bg-white/95 backdrop-blur-md border-sage-200/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="w-12 h-12 text-sage-600 animate-slideIn" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sage-700 to-sage-500 bg-clip-text text-transparent">
              ImmoAI
            </h1>
          </div>
          
          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-xl font-semibold text-sage-700">
              Bienvenue sur votre CRM Immobilier
            </h2>
            <div className="flex items-center justify-center gap-2 text-sage-600">
              <Sparkles className="w-4 h-4" />
              <p>Gérez vos leads et automatisez votre prospection</p>
              <Sparkles className="w-4 h-4" />
            </div>
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
                button: 'w-full flex items-center justify-center gap-2 bg-sage-600 hover:bg-sage-700 text-white transition-colors duration-200',
                input: 'bg-white border-sage-200 focus:border-sage-500 transition-all duration-200',
                label: 'text-sage-700',
                anchor: 'text-sage-600 hover:text-sage-700 transition-colors duration-200',
                message: 'text-sm text-sage-600 flex items-center gap-2',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Adresse email',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  loading_button_label: 'Connexion en cours...',
                  email_input_placeholder: 'agence@immobilier.com',
                  password_input_placeholder: 'Votre mot de passe sécurisé',
                  link_text: 'Pas encore de compte ? Inscrivez-vous',
                },
                sign_up: {
                  email_label: 'Adresse email professionnelle',
                  password_label: 'Choisissez un mot de passe sécurisé',
                  button_label: 'Créer mon compte',
                  loading_button_label: 'Création en cours...',
                  email_input_placeholder: 'votre-agence@immobilier.com',
                  password_input_placeholder: '8 caractères minimum avec chiffres et lettres',
                  confirmation_text: 'En créant un compte, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité',
                  link_text: 'Déjà un compte ? Connectez-vous',
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-sage-500 animate-fadeIn delay-200">
            Optimisez votre prospection immobilière avec l'IA
          </p>
          <div className="mt-4 text-xs text-sage-400">
            Alpes-Maritimes · Monaco · Var
          </div>
        </div>
      </Card>
    </div>
  );
}