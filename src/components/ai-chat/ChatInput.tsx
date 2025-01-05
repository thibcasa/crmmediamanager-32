import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LoadingProgress } from "@/components/ui/loading-progress";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { useAIOrchestrator } from "./AIOrchestrator";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit, placeholder }: ChatInputProps) => {
  const { toast } = useToast();
  const { executeWorkflow } = useAIOrchestrator();
  useSessionCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un objectif",
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

      console.log("Démarrage du workflow avec l'objectif:", input);
      
      // Exécuter le workflow avec l'objectif
      const result = await executeWorkflow(input);
      
      if (result) {
        console.log("Résultat du workflow:", result);
        // Appeler le onSubmit original après l'exécution du workflow
        onSubmit(e);

        toast({
          title: "Succès",
          description: "Votre demande a été traitée avec succès",
        });
      }

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue, veuillez réessayer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <LoadingProgress isLoading={isLoading} />
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-sage-200 bg-white">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder || "Ex: Créer une campagne LinkedIn pour obtenir 4 mandats par semaine..."}
            disabled={isLoading}
            className="flex-1 border-sage-200 focus:ring-sage-500"
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-sage-600 hover:bg-sage-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};