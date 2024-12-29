import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Progress } from "@/components/ui/progress";

const MAX_CHARS = 500;

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const hasShownToast = useRef(false);

  // Vérification de l'authentification au montage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur de session:", error);
          throw error;
        }
        
        if (!session && !hasShownToast.current) {
          console.log("Pas de session active");
          hasShownToast.current = true;
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          window.location.href = '/login';
          return;
        }

        if (session) {
          console.log("Session active:", session.user.id);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          toast({
            title: "Erreur de connexion",
            description: "Une erreur est survenue, veuillez réessayer",
            variant: "destructive",
          });
        }
      }
    };

    checkAuth();
  }, [toast]);

  // Mise à jour de la barre de progression pendant le chargement
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

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
      {isLoading && (
        <div className="px-4">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-xs text-sage-600 mt-1 text-center">
            Génération en cours...
          </p>
        </div>
      )}
      
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
          
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center">
              {isOverLimit && (
                <div className="flex items-center text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Limite de caractères dépassée
                </div>
              )}
            </div>
            <span className={`text-xs ${
              isOverLimit ? 'text-red-500' : 'text-sage-600'
            }`}>
              {charCount}/{MAX_CHARS} caractères
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};