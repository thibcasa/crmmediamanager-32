import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { PropertyAnalyzer } from '@/utils/PropertyAnalyzer';
import { EmailTemplateGenerator } from '@/utils/EmailTemplateGenerator';
import { Textarea } from "@/components/ui/textarea";

export const LeadScraper = () => {
  const { toast } = useToast();
  const [region, setRegion] = useState('alpes-maritimes');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<string[]>([]);

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

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSelectedResult(null);
    setEmailTemplates([]);

    try {
      const websites = [
        `https://www.leboncoin.fr/recherche?category=9&locations=${region}`,
        `https://www.pap.fr/annonce/vente-appartement-maison-${region}`
      ];

      const allResults = [];
      for (const url of websites) {
        const result = await FirecrawlService.crawlWebsite(url);
        if (result.success) {
          const enrichedData = result.data.data.map((item: any) => ({
            ...item,
            analysis: PropertyAnalyzer.analyzeProperty(item.description, item.price)
          }));
          allResults.push(...enrichedData);
        }
      }

      setResults(allResults);
      toast({
        title: "Succès",
        description: `${allResults.length} annonces trouvées dans la région ${region}`
      });
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les annonces",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateEmails = (result: any) => {
    setSelectedResult(result);
    const templates = EmailTemplateGenerator.generateEmailSequence(result.analysis);
    setEmailTemplates(templates);
    toast({
      title: "Succès",
      description: "Séquence d'emails générée avec succès"
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Recherche de Propriétaires</h2>

      {!FirecrawlService.getApiKey() && (
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
      )}

      <form onSubmit={handleScrape} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Région</label>
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="ex: alpes-maritimes"
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !FirecrawlService.getApiKey()} 
          className="w-full"
        >
          {isLoading ? "Recherche en cours..." : "Lancer la recherche"}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Résultats ({results.length})</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{result.title}</p>
                    <p className="text-sm text-gray-600">{result.description}</p>
                    <p className="text-sm text-gray-600">{result.contact}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        Type: {result.analysis.type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        Urgence: {result.analysis.urgency}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleGenerateEmails(result)}
                    variant="outline"
                    size="sm"
                  >
                    Générer emails
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedResult && emailTemplates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Séquence d'emails</h3>
          <div className="space-y-4">
            {emailTemplates.map((template, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-medium mb-2">Email {index + 1}</h4>
                <Textarea
                  value={template}
                  readOnly
                  className="w-full min-h-[200px] font-mono text-sm"
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};