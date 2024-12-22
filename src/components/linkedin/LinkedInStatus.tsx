import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LinkedInConnect } from './LinkedInConnect';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export const LinkedInStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkLinkedInConnection = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsConnected(false);
          setIsLoading(false);
          return;
        }

        const { data: connection, error } = await supabase
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (error) {
          console.error('Error checking LinkedIn connection:', error);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier la connexion LinkedIn",
            variant: "destructive",
          });
        }

        setIsConnected(!!connection);
      } catch (error) {
        console.error('Error in LinkedIn status check:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLinkedInConnection();
  }, [toast]);

  if (isLoading) {
    return <div className="animate-pulse">Vérification de la connexion LinkedIn...</div>;
  }

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Connecté à LinkedIn
        </Badge>
      ) : (
        <LinkedInConnect />
      )}
    </div>
  );
};