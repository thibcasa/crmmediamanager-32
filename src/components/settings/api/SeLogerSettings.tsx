import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Home } from "lucide-react";

export const SeLogerSettings = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");

  const handleConnect = async () => {
    if (!apiKey) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre clé API SeLoger",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ici nous ajouterons la logique de connexion à l'API SeLoger
      toast({
        title: "Connexion réussie",
        description: "Votre compte SeLoger a été connecté avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter à SeLoger",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-medium">SeLoger API</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Synchronisez vos annonces immobilières avec SeLoger
      </p>
      <div className="space-y-4">
        <Input
          type="password"
          placeholder="Clé API SeLoger"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleConnect} className="w-full">
          Connecter SeLoger
        </Button>
      </div>
    </Card>
  );
};