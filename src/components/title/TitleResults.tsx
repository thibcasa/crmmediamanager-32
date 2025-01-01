import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface TitleResultsProps {
  titles: string[];
  onTitleSelect: (title: string) => Promise<void>;
}

export function TitleResults({ titles, onTitleSelect }: TitleResultsProps) {
  const { toast } = useToast();
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTitleSelect = async (title: string) => {
    try {
      setIsProcessing(true);
      setSelectedTitle(title);
      await onTitleSelect(title);
      
      toast({
        title: "Titre sélectionné",
        description: "Le titre a été sélectionné avec succès"
      });
    } catch (error) {
      console.error('Error selecting title:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sélectionner le titre",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le titre a été copié dans le presse-papier"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le titre",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-medium mb-4">Titres générés</h3>
      <div className="space-y-4">
        {titles.map((title, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              selectedTitle === title ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="flex-1">{title}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(title)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleTitleSelect(title)}
                  disabled={isProcessing}
                >
                  {selectedTitle === title ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}