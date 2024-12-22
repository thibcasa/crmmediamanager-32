import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmailTemplateGenerator } from '@/utils/EmailTemplateGenerator';

interface ResultsListProps {
  results: any[];
  onGenerateEmails: (templates: string[]) => void;
}

export const ResultsList = ({ results, onGenerateEmails }: ResultsListProps) => {
  const handleGenerateEmails = (result: any) => {
    const templates = EmailTemplateGenerator.generateEmailSequence(result.analysis);
    onGenerateEmails(templates);
  };

  return (
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
  );
};