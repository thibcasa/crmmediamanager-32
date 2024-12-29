import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const useSessionCheck = () => {
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur de session:", error);
          throw error;
        }
        
        if (!session && !hasShownToast.current) {
          console.log("Pas de session active");
          hasShownToast.current = true;
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          window.location.href = '/login';
          return false;
        }

        if (session) {
          console.log("Session active:", session.user.id);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          toast({
            title: "Erreur de connexion",
            description: "Une erreur est survenue, veuillez réessayer",
            variant: "destructive",
          });
        }
        return false;
      }
    };

    checkAuth();
  }, [toast]);
};