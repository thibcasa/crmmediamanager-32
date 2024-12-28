import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Text, Plus, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Content {
  id: string;
  type: 'post' | 'story' | 'reel' | 'article';
  text: string;
  platform: string;
  performance?: number;
}

export const ContentModule = () => {
  const { toast } = useToast();
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedType, setSelectedType] = useState<Content['type']>('post');
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [newText, setNewText] = useState('');

  const addContent = () => {
    const newContent: Content = {
      id: crypto.randomUUID(),
      type: selectedType,
      text: newText,
      platform: selectedPlatform,
      performance: Math.random()
    };

    setContents([...contents, newContent]);
    setNewText('');
    
    toast({
      title: "Contenu ajouté",
      description: "Le nouveau contenu a été ajouté avec succès"
    });
  };

  const updateContent = (id: string, text: string) => {
    setContents(contents.map(content => 
      content.id === id ? { ...content, text } : content
    ));
    setEditingContent(null);
    
    toast({
      title: "Contenu mis à jour",
      description: "Les modifications ont été enregistrées"
    });
  };

  const deleteContent = (id: string) => {
    setContents(contents.filter(content => content.id !== id));
    toast({
      title: "Contenu supprimé",
      description: "Le contenu a été supprimé avec succès"
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Module Contenus</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos contenus textuels pour la campagne
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une plateforme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType as any}>
            <SelectTrigger>
              <SelectValue placeholder="Type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post">Publication</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="article">Article</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Entrez votre contenu..."
          className="min-h-[100px]"
        />

        <Button 
          onClick={addContent}
          disabled={!newText.trim()}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter le contenu
        </Button>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {contents.map((content) => (
            <Card key={content.id} className="p-4">
              {editingContent?.id === content.id ? (
                <div className="space-y-4">
                  <Textarea
                    value={editingContent.text}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      text: e.target.value
                    })}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingContent(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateContent(content.id, editingContent.text)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-medium capitalize">
                        {content.type}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {content.platform}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingContent(content)}
                      >
                        <Text className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteContent(content.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{content.text}</p>
                  {content.performance && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="flex-1 h-2 bg-sage-100 rounded-full">
                        <div
                          className="h-full bg-sage-500 rounded-full"
                          style={{ width: `${content.performance * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-sage-600">
                        {(content.performance * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};