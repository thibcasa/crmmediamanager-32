import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Linkedin } from 'lucide-react';

export const LinkedInConnect = () => {
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'w_member_social',
        }
      });

      if (error) {
        console.error('LinkedIn connection error:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à LinkedIn",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error connecting to LinkedIn:', error);
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