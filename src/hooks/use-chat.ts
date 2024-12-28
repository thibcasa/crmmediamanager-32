import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "./use-toast";

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour continuer",
          variant: "destructive",
        });
        return;
      }

      // Appel à l'API de génération de contenu
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          type: 'social',
          prompt: content,
          platform: 'linkedin',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes",
          tone: "professionnel et confiant"
        }
      });

      if (error) throw error;

      return {
        message: data.content
      };
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};