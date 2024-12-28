import { useEffect, useState } from "react";
import { SocialCampaigns } from "@/components/SocialCampaigns";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Campaigns() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur de session:", error);
          throw error;
        }
        
        if (!session) {
          console.log("Vérification de la session : pas de session active");
          return;
        }

        console.log("Session active:", session.user.id);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        toast({
          title: "Erreur de connexion",
          description: "Une erreur est survenue lors du chargement des campagnes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Campagnes Marketing</h1>
      <SocialCampaigns />
    </div>
  );
}