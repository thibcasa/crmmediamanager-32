import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export const EmailCampaign = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here we'll integrate with SendGrid once Supabase is connected
      toast({
        title: "Succès",
        description: "Campagne créée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAITemplate = async () => {
    // This will be implemented with OpenAI/Anthropic once Supabase is connected
    toast({
      title: "Info",
      description: "Génération du template en cours...",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Campagne Email</h2>
      <form onSubmit={handleCreateCampaign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Objet</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de l'email"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Contenu de l'email"
            className="w-full min-h-[200px]"
          />
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={generateAITemplate}>
            Générer avec l'IA
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer la campagne"}
          </Button>
        </div>
      </form>
    </Card>
  );
};