import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/AIService";
import { Send, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLE_PROMPTS = [
  {
    title: "Campagne Instagram Reels",
    prompt: "Crée une campagne Instagram Reels pour obtenir 8 mandats de vente cette semaine dans les Alpes-Maritimes",
    description: "Génère une stratégie complète de contenu Reels avec scripts et actions"
  },
  {
    title: "Workflow Complet",
    prompt: "Génère un workflow complet pour convertir les leads immobiliers en mandats",
    description: "Création d'un parcours automatisé de nurturing et conversion"
  },
  {
    title: "Campagne Multi-Canal",
    prompt: "Crée une stratégie marketing multi-canal (email, WhatsApp, réseaux sociaux) pour toucher les propriétaires",
    description: "Orchestration de messages cohérents sur tous les canaux"
  },
  {
    title: "Contenu Créatif TikTok",
    prompt: "Propose une série de vidéos TikTok ciblant les propriétaires immobiliers des Alpes-Maritimes",
    description: "Concepts créatifs et scripts pour TikTok"
  }
];

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Tu es un expert en marketing immobilier et stratégie de prospection dans les Alpes-Maritimes.
      Pour chaque demande, tu dois :
      1. Analyser l'objectif et proposer une stratégie claire
      2. Détailler les actions concrètes à mettre en place
      3. Fournir des exemples de contenu et messages
      4. Définir les automatisations et workflows nécessaires
      5. Suggérer des métriques de suivi
      
      Sois précis et actionnable dans tes recommandations.`;
      
      const response = await AIService.generateContent('description', `${systemPrompt}\n\nObjectif: ${userMessage}`);
      
      // Ensure we have a string response
      const assistantMessage = typeof response === 'string' ? response : 
        (response?.content ? response.content : JSON.stringify(response));
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });

      toast({
        title: "Stratégie générée",
        description: "Les recommandations ont été générées avec succès.",
      });
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les recommandations pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Assistant Stratégique Immobilier</h1>
          <p className="text-muted-foreground mt-2">
            Je vous aide à créer et orchestrer vos stratégies de prospection immobilière
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <Card 
              key={index}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleExampleClick(prompt.prompt)}
            >
              <div className="flex items-start space-x-2">
                <Sparkles className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">{prompt.title}</h3>
                  <p className="text-sm text-muted-foreground">{prompt.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'assistant'
                    ? 'bg-primary/10 rounded-lg p-4'
                    : 'bg-white border rounded-lg p-4'
                }`}
              >
                <p className="text-sm font-semibold mb-2">
                  {message.role === 'assistant' ? 'Assistant Stratégique' : 'Vous'}
                </p>
                <div className="text-sm prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Génération de la stratégie...</p>
                </div>
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Crée une campagne Instagram pour obtenir des mandats..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AiChat;