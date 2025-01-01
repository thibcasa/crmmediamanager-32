import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function TitleModule() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("property_owners");
  const [propertyType, setPropertytyType] = useState("luxury");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateTitles = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating titles with input:', { subject, tone, targetAudience, propertyType });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          action: 'generate_titles',
          subject,
          tone,
          targetAudience,
          propertyType,
          count: 3
        }
      });

      if (error) throw error;

      setGeneratedTitles(data.titles);
      
      // Log the successful generation
      await supabase.from('automation_logs').insert({
        user_id: user.id,
        action_type: 'title_generation',
        description: 'Generated real estate titles',
        metadata: {
          subject,
          tone,
          targetAudience,
          propertyType,
          generated_titles: data.titles
        }
      });

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
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Module Titre</h1>
      
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
              <Select value={propertyType} onValueChange={setPropertytyType}>
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
          </div>

          {generatedTitles.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Titres générés</h3>
              <div className="space-y-2">
                {generatedTitles.map((title, index) => (
                  <Card key={index} className="p-4">
                    <p>{title}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}