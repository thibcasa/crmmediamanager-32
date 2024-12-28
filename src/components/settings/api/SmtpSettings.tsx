import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export const SmtpSettings = () => {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save SMTP credentials logic here
      toast({
        title: "Configuration sauvegardée",
        description: "Vos paramètres SMTP ont été enregistrés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres SMTP.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSaveSmtp} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Configuration SMTP</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configurez un serveur SMTP personnalisé pour l'envoi d'emails.
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Serveur SMTP</label>
          <Input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="smtp.votreserveur.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Port</label>
          <Input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="587"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom d'utilisateur</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Mot de passe</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
          />
        </div>
        <Button type="submit">Sauvegarder</Button>
      </form>
    </Card>
  );
};