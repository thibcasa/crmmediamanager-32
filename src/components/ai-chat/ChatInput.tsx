import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  const { toast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error("Authentication error:", error);
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous connecter pour continuer",
          variant: "destructive",
        });
        // Redirect to login if needed
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input before submission
    if (!input.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un message",
        variant: "destructive",
      });
      return;
    }

    // Check authentication again before submitting
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous reconnecter",
        variant: "destructive",
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-sage-200 bg-white">
      <div className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ex: Crée une stratégie LinkedIn pour obtenir des mandats..."
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
  );
};