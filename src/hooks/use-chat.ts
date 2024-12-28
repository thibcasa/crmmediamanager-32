import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // Simuler un délai de réponse
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        message: "Voici une réponse simulée. Dans une vraie implémentation, nous enverrions le message à une API."
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};