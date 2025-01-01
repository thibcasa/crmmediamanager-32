import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "./use-toast";
import { Message } from "@/components/ai-chat/types/chat";

export const useChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
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

      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: content
      };
      setMessages(prev => [...prev, userMessage]);

      console.log('Sending message to AI chat function:', content);

      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { 
          message: content,
          userId: session.user.id
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data?.content) {
        throw new Error('No response content received');
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      };
      setMessages(prev => [...prev, assistantMessage]);

      return data;
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
    isLoading,
    messages
  };
};