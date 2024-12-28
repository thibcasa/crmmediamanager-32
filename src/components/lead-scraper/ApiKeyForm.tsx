import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';

interface ApiKeyFormProps {
  onSave?: (key: string) => Promise<void>;
  isLoading?: boolean;
  serviceName?: string;
}

export const ApiKeyForm = ({ onSave, isLoading = false, serviceName = 'Firecrawl' }: ApiKeyFormProps) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');

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
      } else {
        const isValid = await FirecrawlService.testApiKey(apiKey);
        if (isValid) {
          FirecrawlService.saveApiKey(apiKey);
          toast({
            title: "Succès",
            description: "Clé API sauvegardée avec succès",
          });
        } else {
          toast({
            title: "Erreur",
            description: "Clé API invalide",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier la clé API",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Clé API {serviceName}</label>
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Entrez votre clé API ${serviceName}`}
            className="flex-1"
          />
          <Button onClick={handleSaveApiKey} disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
};