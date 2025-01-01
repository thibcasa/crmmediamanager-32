import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";
import { LoadingProgress } from "@/components/ui/loading-progress";

interface TitleFormProps {
  onSubmit: (subject: string, tone: string, targetAudience: string, propertyType: string) => Promise<void>;
  isGenerating: boolean;
}

export function TitleForm({ onSubmit, isGenerating }: TitleFormProps) {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("property_owners");
  const [propertyType, setPropertyType] = useState("luxury");

  const handleSubmit = async () => {
    await onSubmit(subject, tone, targetAudience, propertyType);
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Générateur de Titres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          onClick={handleSubmit}
          disabled={isGenerating || !subject}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Wand2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer des titres
            </>
          )}
        </Button>

        {isGenerating && <LoadingProgress isLoading={isGenerating} />}
      </CardContent>
    </Card>
  );
}