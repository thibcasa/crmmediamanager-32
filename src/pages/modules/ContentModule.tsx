import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Copy, Download, BarChart2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from 'react-router-dom';

export default function ContentModule() {
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('property_owners');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState('article');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load data from previous steps
  useEffect(() => {
    const loadPreviousSteps = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get latest subject
      const { data: subjectData } = await supabase
        .from('generated_titles')
        .select('subject, generated_title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (subjectData?.[0]) {
        setSubject(subjectData[0].subject);
        setTitle(subjectData[0].generated_title);
      }
    };

    loadPreviousSteps();
  }, []);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un sujet",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-workflow-generator', {
        body: {
          subject,
          title,
          tone,
          audience,
          keywords: keywords.split(',').map(k => k.trim()),
          contentType,
          language: 'french'
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast({
        title: "Contenu généré",
        description: "Le contenu a été généré avec succès"
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papier"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive"
      });
    }
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contenu-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Module Rédaction</h1>
        <Button variant="outline" onClick={() => navigate('/modules/title')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux Titres
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Données des étapes précédentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sujet sélectionné</label>
            <p className="text-muted-foreground">{subject}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre généré</label>
            <p className="text-muted-foreground">{title}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Générateur de Contenu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tonalité</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une tonalité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professionnel</SelectItem>
                  <SelectItem value="conversational">Conversationnel</SelectItem>
                  <SelectItem value="luxury">Haut de gamme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Public cible</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un public" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property_owners">Propriétaires</SelectItem>
                  <SelectItem value="investors">Investisseurs</SelectItem>
                  <SelectItem value="luxury_buyers">Acheteurs de luxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mots-clés SEO</label>
            <Textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Entrez vos mots-clés séparés par des virgules..."
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de contenu</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="social_post">Post social</SelectItem>
                <SelectItem value="property_description">Description de bien</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !subject.trim()}
            className="w-full"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Génération en cours..." : "Générer le contenu"}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle>Contenu généré</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap">{generatedContent}</pre>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copier
              </Button>
              <Button variant="outline" onClick={downloadContent}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button variant="outline">
                <BarChart2 className="mr-2 h-4 w-4" />
                Analyser SEO
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}