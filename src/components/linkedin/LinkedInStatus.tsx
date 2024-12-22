import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkedInConnect } from "./LinkedInConnect";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export const LinkedInStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLinkedInConnection = async () => {
      try {
        console.log("Checking LinkedIn connection status...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No authenticated user found");
          setError("Vous devez être connecté pour utiliser LinkedIn");
          return;
        }

        const { data: connection, error: fetchError } = await supabase
          .from('linkedin_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (fetchError) {
          console.error("Error fetching LinkedIn connection:", fetchError);
          throw fetchError;
        }

        console.log("LinkedIn connection status:", connection ? "Connected" : "Not connected");
        setIsConnected(!!connection);
      } catch (err) {
        console.error("Error checking LinkedIn status:", err);
        setError("Impossible de vérifier la connexion LinkedIn");
      } finally {
        setIsLoading(false);
      }
    };

    checkLinkedInConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sage-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Vérification de la connexion LinkedIn...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <XCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-green-600">Connecté à LinkedIn</span>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-sage-500" />
            <span className="text-sage-600">Non connecté à LinkedIn</span>
          </>
        )}
      </div>
      
      {!isConnected && (
        <Card className="p-4 bg-sage-50">
          <p className="text-sage-700 mb-4">
            Connectez votre compte LinkedIn pour commencer à publier du contenu automatiquement.
          </p>
          <LinkedInConnect />
        </Card>
      )}
    </div>
  );
};