import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export const GmailSettings = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const handleSaveGmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save API credentials logic here
      toast({
        title: "Configuration sauvegardée",
        description: "Vos identifiants Gmail ont été enregistrés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les identifiants Gmail.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSaveGmail} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Configuration Gmail</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connectez votre compte Gmail pour gérer vos emails.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Client ID</label>
          <Input
            type="password"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Entrez votre Client ID Gmail"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Client Secret</label>
          <Input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="Entrez votre Client Secret Gmail"
          />
        </div>
        <Button type="submit">Sauvegarder</Button>
      </form>
    </Card>
  );
};