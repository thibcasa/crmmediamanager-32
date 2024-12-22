import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { PropertyAnalyzer } from '@/utils/PropertyAnalyzer';

interface SearchFormProps {
  onResults: (results: any[]) => void;
  onError: (error: string) => void;
}

export const SearchForm = ({ onResults, onError }: SearchFormProps) => {
  const [region, setRegion] = useState('alpes-maritimes');
  const [isLoading, setIsLoading] = useState(false);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

      onResults(allResults);
    } catch (error) {
      console.error('Erreur lors du scraping:', error);
      onError("Impossible de récupérer les annonces");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};