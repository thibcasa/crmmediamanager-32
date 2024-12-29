import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface GeneratedContentDisplayProps {
  content: {
    seoTitles: string[];
    content: string;
    imageUrl: string;
    imagePrompt: string;
  };
}

export const GeneratedContentDisplay = ({ content }: GeneratedContentDisplayProps) => {
  const { toast } = useToast();
  const [copiedTitle, setCopiedTitle] = useState<number | null>(null);
  const [copiedContent, setCopiedContent] = useState(false);

  const copyToClipboard = async (text: string, type: 'title' | 'content', index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'title') {
        setCopiedTitle(index || null);
        setTimeout(() => setCopiedTitle(null), 2000);
      } else {
        setCopiedContent(true);
        setTimeout(() => setCopiedContent(false), 2000);
      }
      toast({
        title: "Copié !",
        description: "Le texte a été copié dans le presse-papier."
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte.",
        variant: "destructive"
      });
    }
  };

  if (!content) return null;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="font-medium mb-4">Titres SEO proposés</h4>
        <div className="space-y-2">
          {content.seoTitles.map((title, index) => (
            <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded-lg">
              <p className="text-sm flex-1">{title}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(title, 'title', index)}
              >
                {copiedTitle === index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium">Contenu généré</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(content.content, 'content')}
          >
            {copiedContent ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm whitespace-pre-wrap">{content.content}</p>
      </Card>

      {content.imageUrl && (
        <Card className="p-6">
          <h4 className="font-medium mb-4">Visuel généré</h4>
          <div className="space-y-4">
            <img 
              src={content.imageUrl} 
              alt="Visuel de campagne"
              className="w-full rounded-lg"
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Prompt utilisé :</span> {content.imagePrompt}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};