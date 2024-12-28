import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export const BrevoSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSaveBrevo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save API key logic here
      toast({
        title: "Configuration sauvegardée",
        description: "Vos identifiants Brevo ont été enregistrés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les identifiants Brevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSaveBrevo} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Configuration Brevo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connectez votre compte Brevo pour gérer vos campagnes email.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Clé API Brevo</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Entrez votre clé API Brevo"
          />
        </div>
        <Button type="submit">Sauvegarder</Button>
      </form>
    </Card>
  );
};