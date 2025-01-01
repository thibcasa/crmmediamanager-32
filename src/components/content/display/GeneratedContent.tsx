import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContentProps {
  content: string;
  onRegenerate?: () => void;
}

export const GeneratedContent = ({ content, onRegenerate }: GeneratedContentProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contenu-genere.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Card className="p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Contenu généré</h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copier
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </div>
      <div className="prose max-w-none">
        {content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      {onRegenerate && (
        <Button 
          onClick={onRegenerate}
          variant="outline"
          className="mt-4"
        >
          Régénérer
        </Button>
      )}
    </Card>
  );
};