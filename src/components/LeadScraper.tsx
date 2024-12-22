import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { ApiKeyForm } from './lead-scraper/ApiKeyForm';
import { SearchForm } from './lead-scraper/SearchForm';
import { ResultsList } from './lead-scraper/ResultsList';

export const LeadScraper = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<any[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<string[]>([]);

  const handleResults = (newResults: any[]) => {
    setResults(newResults);
    toast({
      title: "Succès",
      description: `${newResults.length} annonces trouvées`
    });
  };

  const handleError = (error: string) => {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive"
    });
  };

  const handleGenerateEmails = (templates: string[]) => {
    setEmailTemplates(templates);
    toast({
      title: "Succès",
      description: "Séquence d'emails générée avec succès"
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Recherche de Propriétaires</h2>

      {!FirecrawlService.getApiKey() && <ApiKeyForm />}

      <SearchForm onResults={handleResults} onError={handleError} />

      {results.length > 0 && (
        <ResultsList 
          results={results}
          onGenerateEmails={handleGenerateEmails}
        />
      )}

      {emailTemplates.length > 0 && (
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