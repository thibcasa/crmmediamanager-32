import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';

export const ApiKeyForm = () => {
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
        <label className="block text-sm font-medium mb-2">Clé API Firecrawl</label>
        <div className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Entrez votre clé API Firecrawl"
            className="flex-1"
          />
          <Button onClick={handleSaveApiKey}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};