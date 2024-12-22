import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LinkedinIcon, Loader2, CheckCircle, XCircle } from "lucide-react";
import { LinkedInConnect } from "./LinkedInConnect";

export const LinkedInStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const { data: connection, error } = await supabase
        .from('linkedin_connections')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error checking LinkedIn connection:', error);
        throw error;
      }

      setIsConnected(!!connection);
    } catch (error) {
      console.error('Error checking connection:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier la connexion LinkedIn.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const { data: connection, error: fetchError } = await supabase
        .from('linkedin_connections')
        .select('*')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (connection) {
        const { error: deleteError } = await supabase
          .from('linkedin_connections')
          .delete()
          .eq('id', connection.id);

        if (deleteError) throw deleteError;

        setIsConnected(false);
        toast({
          title: "Déconnecté",
          description: "Votre compte LinkedIn a été déconnecté.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de déconnecter le compte LinkedIn.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Vérification de la connexion...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center justify-between gap-4 p-4 border rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Connecté à LinkedIn</span>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDisconnect}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Déconnecter
        </Button>
      </div>
    );
  }

  return <LinkedInConnect />;
};