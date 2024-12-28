import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Loader2 } from 'lucide-react';

interface ContentFormProps {
  isGenerating: boolean;
  contentType: string;
  platform: string;
  objective: string;
  onContentTypeChange: (value: any) => void;
  onPlatformChange: (value: any) => void;
  onObjectiveChange: (value: string) => void;
  onGenerate: () => void;
}

export const ContentForm = ({
  isGenerating,
  contentType,
  platform,
  objective,
  onContentTypeChange,
  onPlatformChange,
  onObjectiveChange,
  onGenerate
}: ContentFormProps) => {
  return (
    <div className="space-y-4">
      <Select value={platform} onValueChange={onPlatformChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir une plateforme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
        </SelectContent>
      </Select>

      <Select value={contentType} onValueChange={onContentTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un type de contenu" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="post">Publication</SelectItem>
          <SelectItem value="story">Story</SelectItem>
          <SelectItem value="reel">Reel</SelectItem>
          <SelectItem value="article">Article</SelectItem>
        </SelectContent>
      </Select>

      <Textarea
        placeholder="Ex: Promouvoir un webinaire sur l'investissement immobilier..."
        value={objective}
        onChange={(e) => onObjectiveChange(e.target.value)}
        className="min-h-[100px]"
      />

      <Button
        onClick={onGenerate}
        disabled={isGenerating || !objective}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Générer le contenu
          </>
        )}
      </Button>
    </div>
  );
};