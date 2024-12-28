import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Vérification de l\'authentification...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur d\'authentification:', error);
          throw error;
        }
        
        if (!session) {
          console.log('Pas de session active, redirection vers login');
          toast({
            title: "Session expirée",
            description: "Veuillez vous connecter pour accéder à cette page",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        console.log('Session active:', session.user.id);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        toast({
          title: "Erreur de session",
          description: "Une erreur est survenue, veuillez vous reconnecter",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Changement d\'état d\'authentification:', event, session);
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};