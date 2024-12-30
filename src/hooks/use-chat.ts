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

      // Ajouter le message de l'utilisateur
      const userMessage: Message = {
        role: 'user',
        content: content
      };
      setMessages(prev => [...prev, userMessage]);

      // Appel à l'Edge Function de génération de contenu
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: { prompt: content }
      });

      if (error) throw error;

      // Ajouter la réponse de l'assistant
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content.text,
        metadata: {
          type: data.content.type,
          platform: data.content.platform,
          targetAudience: data.content.targetAudience,
          metrics: data.content.metrics
        }
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Sauvegarder la conversation dans Supabase
      await supabase.from('automation_logs').insert({
        user_id: session.user.id,
        action_type: 'chat_message',
        description: 'Message envoyé et réponse générée',
        metadata: {
          user_message: content,
          ai_response: data.content
        }
      });

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