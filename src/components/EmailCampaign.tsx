import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { IntegrationService } from '@/services/IntegrationService';
import { Loader2 } from "lucide-react";

export const EmailCampaign = () => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testEmail] = useState('thibault.casabianca.optimhome@gmail.com');

  useEffect(() => {
    generateAITemplate();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await IntegrationService.sendEmail([testEmail], subject, template);
      toast({
        title: "Succès",
        description: "Email envoyé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAITemplate = async () => {
    setIsGenerating(true);
    try {
      const generatedSubject = await IntegrationService.generateContent(
        "Générer un objet d'email professionnel et accrocheur pour une agence immobilière qui cherche des biens à vendre dans les Alpes-Maritimes",
        'email'
      );
      setSubject(generatedSubject);

      const content = await IntegrationService.generateContent(
        "Générer un email professionnel pour une agence immobilière qui cherche des biens à vendre dans les Alpes-Maritimes. L'email doit être personnalisé, mettre en avant l'expertise locale et proposer une estimation gratuite.",
        'email'
      );
      setTemplate(content);
      
      toast({
        title: "Succès",
        description: "Template généré avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le template",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Campagne Email</h2>
      <form onSubmit={handleCreateCampaign} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email de test</label>
          <Input
            type="email"
            value={testEmail}
            className="w-full bg-gray-100"
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Objet</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de l'email"
            className="w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Contenu de l'email"
            className="w-full min-h-[200px]"
            required
          />
        </div>
        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={generateAITemplate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              'Générer avec l\'IA'
            )}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </>
            ) : (
              'Tester l\'envoi'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};