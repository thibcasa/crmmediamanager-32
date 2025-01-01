import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ContentGeneratorFormProps {
  onSubmit: (formData: {
    subject: string;
    tone: string;
    audience: string;
    keywords: string;
    contentType: string;
    language: string;
  }) => void;
  isGenerating: boolean;
}

export const ContentGeneratorForm = ({ onSubmit, isGenerating }: ContentGeneratorFormProps) => {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("property_owners");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("article");
  const [language, setLanguage] = useState("french");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject,
      tone,
      audience,
      keywords,
      contentType,
      language
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Sujet</label>
        <Textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Investir dans une villa de luxe à Nice"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tonalité</label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une tonalité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professionnel</SelectItem>
              <SelectItem value="conversational">Conversationnel</SelectItem>
              <SelectItem value="luxury">Luxe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Public cible</label>
          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une cible" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property_owners">Propriétaires</SelectItem>
              <SelectItem value="investors">Investisseurs</SelectItem>
              <SelectItem value="luxury_buyers">Acheteurs luxe</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Mots-clés SEO</label>
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Ex: villa luxe, investissement, Côte d'Azur (séparés par des virgules)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type de contenu</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="social_post">Post social</SelectItem>
              <SelectItem value="property_description">Description bien</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Langue</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une langue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="french">Français</SelectItem>
              <SelectItem value="english">Anglais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isGenerating || !subject.trim()}
        className="w-full"
      >
        {isGenerating ? "Génération en cours..." : "Générer le contenu"}
      </Button>
    </form>
  );
};