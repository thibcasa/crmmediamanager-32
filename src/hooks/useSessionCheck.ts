import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const useSessionCheck = () => {
  const { toast } = useToast();
  const hasShownToast = useRef(false);
  const navigate = useNavigate();
  const isChecking = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session && !hasShownToast.current) {
          hasShownToast.current = true;
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          navigate('/login');
        }
      } catch (error) {
        console.error("Erreur de vérification de session:", error);
      } finally {
        isChecking.current = false;
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          navigate('/login');
        }
      } else if (session) {
        hasShownToast.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);
};