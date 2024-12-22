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
import { supabase } from "@/lib/supabaseClient";

const EXAMPLE_PROMPTS = [
  {
    title: "Campagne LinkedIn Ciblée",
    prompt: "Crée une stratégie de prospection sur LinkedIn pour contacter 50 propriétaires immobiliers dans les Alpes-Maritimes",
    description: "Génère une stratégie complète de messages et connexions LinkedIn"
  },
  {
    title: "Campagne Multi-Réseaux",
    prompt: "Crée une stratégie marketing combinant LinkedIn et Instagram pour obtenir 8 mandats cette semaine",
    description: "Orchestration de messages cohérents sur LinkedIn et Instagram"
  },
  {
    title: "Workflow Automatisé",
    prompt: "Génère un workflow complet de nurturing LinkedIn pour convertir les prospects en mandats",
    description: "Création d'un parcours automatisé de conversion"
  },
  {
    title: "Contenu Engageant",
    prompt: "Propose une série de posts LinkedIn et Instagram ciblant les propriétaires immobiliers",
    description: "Concepts créatifs et scripts pour les réseaux sociaux"
  }
];

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkLinkedInConnection = async () => {
    const { data: connection, error } = await supabase
      .from('linkedin_connections')
      .select('*')
      .single();

    if (error || !connection) {
      toast({
        title: "LinkedIn non connecté",
        description: "Connectez votre compte LinkedIn pour activer toutes les fonctionnalités.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Vérifier la connexion LinkedIn si nécessaire
      if (userMessage.toLowerCase().includes('linkedin')) {
        const isConnected = await checkLinkedInConnection();
        if (!isConnected) {
          setIsLoading(false);
          return;
        }
      }

      const systemPrompt = `Tu es un expert en stratégie immobilière et marketing digital pour les Alpes-Maritimes.
      Pour chaque demande, tu dois :
      1. Analyser l'objectif et proposer une stratégie détaillée
      2. Créer un plan d'action concret avec :
         - Messages et contenus spécifiques pour chaque réseau social
         - Séquences d'automatisation et workflows
         - Templates de messages personnalisés
         - Suggestions de visuels et créatifs
      3. Définir les KPIs et métriques de suivi
      4. Proposer un calendrier d'actions
      
      Sois précis et actionnable dans tes recommandations.
      Priorise les actions à fort impact et propose des modèles de messages.`;
      
      const response = await AIService.generateContent('description', `${systemPrompt}\n\nObjectif: ${userMessage}`);
      
      const assistantMessage = typeof response === 'string' ? response : 
        (response?.content ? response.content : JSON.stringify(response));
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Invalider les requêtes pertinentes
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['linkedin-connections'] });

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
            Je coordonne vos stratégies de prospection et génère du contenu pour tous vos canaux
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
              placeholder="Ex: Crée une stratégie LinkedIn pour obtenir des mandats..."
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