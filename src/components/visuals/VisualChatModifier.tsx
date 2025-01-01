import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "lucide-react";

interface VisualChatModifierProps {
  imageUrl: string;
}

export const VisualChatModifier = ({ imageUrl }: VisualChatModifierProps) => {
  const [prompt, setPrompt] = useState("");
  const [isModifying, setIsModifying] = useState(false);
  const { toast } = useToast();

  const handleModifyVisual = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une instruction de modification",
        variant: "destructive",
      });
      return;
    }

    setIsModifying(true);
    try {
      // Here we'll integrate with the AI chat service for modifications
      toast({
        title: "Info",
        description: "Fonctionnalité de modification en développement"
      });
    } catch (error) {
      console.error('Error modifying visual:', error);
      toast({
        title: "Erreur",
        description: "La modification a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier le Visuel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img 
              src={imageUrl} 
              alt="Visuel généré" 
              className="object-cover"
            />
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium">Instructions de modification</label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Ajouter une piscine à débordement..."
          />
        </div>

        <Button
          onClick={handleModifyVisual}
          disabled={isModifying}
          className="w-full"
        >
          {isModifying ? "Modification en cours..." : "Modifier le visuel"}
        </Button>
      </CardContent>
    </Card>
  );
};