import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyFormProps {
  onSave?: (key: string) => Promise<void>;
  isLoading?: boolean;
  serviceName?: string;
  defaultValue?: string;
  placeholder?: string;
}

export const ApiKeyForm = ({ 
  onSave, 
  isLoading = false, 
  serviceName = 'Firecrawl',
  defaultValue = '',
  placeholder = ''
}: ApiKeyFormProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(defaultValue);

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une clé API",
        variant: "destructive",
      });
      return;
    }

    try {
      if (onSave) {
        await onSave(apiKey);
      }

      toast({
        title: "Succès",
        description: `Clé API ${serviceName} sauvegardée avec succès`,
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder la clé API ${serviceName}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Clé API {serviceName}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Configurez votre clé API {serviceName} pour activer les fonctionnalités associées.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={placeholder || `Entrez votre clé API ${serviceName}`}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey} disabled={isLoading}>
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};