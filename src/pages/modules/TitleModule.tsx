import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2, Copy, Check, Edit2, Save } from "lucide-react";
import { TitleResults } from "@/components/title/TitleResults";
import { supabase } from "@/lib/supabaseClient";
import { Progress } from "@/components/ui/progress";

export default function TitleModule() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("property_owners");
  const [propertyType, setPropertyType] = useState("luxury");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleGenerateTitles = async () => {
    try {
      setIsGenerating(true);
      setProgress(25);
      console.log('Generating titles with input:', { subject, tone, targetAudience, propertyType });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_titles',
          subject,
          tone,
          targetAudience,
          propertyType,
          count: 5
        }
      });

      if (error) throw error;

      setProgress(75);
      
      // Store generated titles in history
      await Promise.all(data.titles.map(async (title: string) => {
        await supabase.from('generated_titles').insert({
          user_id: user.id,
          subject,
          generated_title: title,
          metadata: {
            tone,
            targetAudience,
            propertyType
          }
        });
      }));

      setGeneratedTitles(data.titles);
      setProgress(100);
      
      toast({
        title: "Titres générés",
        description: "Vos titres ont été générés avec succès",
      });
    } catch (error) {
      console.error('Error generating titles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les titres",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleTitleEdit = (title: string) => {
    setEditingTitle(title);
    setEditedTitle(title);
  };

  const handleSaveEdit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Update the title in history
      await supabase
        .from('generated_titles')
        .update({ generated_title: editedTitle })
        .match({ 
          user_id: user.id,
          generated_title: editingTitle 
        });

      // Update local state
      setGeneratedTitles(titles => 
        titles.map(t => t === editingTitle ? editedTitle : t)
      );
      
      setEditingTitle(null);
      toast({
        title: "Titre modifié",
        description: "Le titre a été modifié avec succès"
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le titre",
        variant: "destructive"
      });
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
    <div className="space-y-6 p-4">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Générateur de Titres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Sujet</Label>
              <Textarea
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Investissement immobilier de luxe sur la Côte d'Azur..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Tonalité</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une tonalité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="conversational">Conversationnel</SelectItem>
                  <SelectItem value="luxury">Haut de gamme</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Public cible</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un public cible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property_owners">Propriétaires</SelectItem>
                  <SelectItem value="investors">Investisseurs</SelectItem>
                  <SelectItem value="luxury_buyers">Acheteurs de luxe</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">Type de bien</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxe</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="apartment">Appartement</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerateTitles}
              disabled={isGenerating || !subject}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Générer des titres
                </>
              )}
            </Button>

            {progress > 0 && (
              <Progress value={progress} className="w-full" />
            )}
          </div>

          {generatedTitles.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Titres générés</h3>
              {generatedTitles.map((title, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-border"
                >
                  {editingTitle === title ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveEdit}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
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
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTitleEdit(title)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}