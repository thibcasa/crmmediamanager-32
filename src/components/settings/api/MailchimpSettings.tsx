import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export const MailchimpSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [listId, setListId] = useState("");
  const { toast } = useToast();

  const handleSaveMailchimp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save API key and list ID logic here
      toast({
        title: "Configuration sauvegardée",
        description: "Vos identifiants Mailchimp ont été enregistrés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les identifiants Mailchimp.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSaveMailchimp} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Configuration Mailchimp</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connectez votre compte Mailchimp pour gérer vos campagnes email.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Clé API Mailchimp</label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Entrez votre clé API Mailchimp"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">ID de Liste</label>
          <Input
            type="text"
            value={listId}
            onChange={(e) => setListId(e.target.value)}
            placeholder="Entrez l'ID de votre liste Mailchimp"
          />
        </div>
        <Button type="submit">Sauvegarder</Button>
      </form>
    </Card>
  );
};