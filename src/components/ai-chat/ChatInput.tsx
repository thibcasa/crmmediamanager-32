import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LoadingProgress } from "@/components/ui/loading-progress";
import { CharacterCounter } from "@/components/chat/CharacterCounter";
import { useSessionCheck } from "@/hooks/useSessionCheck";

const MAX_CHARS = 500;

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  const { toast } = useToast();
  useSessionCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un message",
        variant: "destructive",
      });
      return;
    }

    if (input.length > MAX_CHARS) {
      toast({
        title: "Erreur",
        description: `Le message ne peut pas dépasser ${MAX_CHARS} caractères`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        return;
      }

      onSubmit(e);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  const charCount = input.length;
  const isOverLimit = charCount > MAX_CHARS;

  return (
    <div className="space-y-2">
      <LoadingProgress isLoading={isLoading} />
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-sage-200 bg-white">
        <div className="space-y-2">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ex: Crée une stratégie LinkedIn pour obtenir des mandats..."
              disabled={isLoading}
              className={`flex-1 border-sage-200 focus:ring-sage-500 ${
                isOverLimit ? 'border-red-500' : ''
              }`}
            />
            <Button 
              type="submit" 
              disabled={isLoading || isOverLimit}
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <CharacterCounter 
            currentLength={charCount}
            maxLength={MAX_CHARS}
          />
        </div>
      </form>
    </div>
  );
};