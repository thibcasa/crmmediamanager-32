import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/AIService";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LinkedInStatus } from "@/components/linkedin/LinkedInStatus";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { supabase } from "@/lib/supabaseClient";

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

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Assistant Stratégique Immobilier</h1>
          <p className="text-muted-foreground mt-2">
            Je coordonne vos stratégies de prospection et génère du contenu pour tous vos canaux
          </p>
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Connexion LinkedIn</h2>
          <LinkedInStatus />
        </Card>

        <ExamplePrompts onPromptClick={setInput} />

        <Card className="flex flex-col h-[600px]">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default AiChat;