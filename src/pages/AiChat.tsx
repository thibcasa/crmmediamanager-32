import { useState } from 'react';
import { ChatMessages } from '@/components/ai-chat/ChatMessages';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { TestWorkflow } from '@/components/ai-chat/TestWorkflow';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      // Ajouter le message de l'utilisateur
      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Appeler l'API de génération de contenu
      const { data, error } = await supabase.functions.invoke('content-generator', {
        body: {
          prompt: input,
          type: 'strategy',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes",
          tone: "professionnel et stratégique"
        }
      });

      if (error) throw error;

      // Ajouter la réponse de l'assistant
      const assistantMessage = {
        role: 'assistant' as const,
        content: data?.content || "Je n'ai pas pu générer de réponse. Veuillez réessayer."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la réponse. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir le dernier message de l'utilisateur pour le test
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Assistant IA</h1>
        <p className="text-muted-foreground mt-2">
          Générez des stratégies marketing et du contenu optimisé pour l'immobilier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col h-[600px]">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={(value) => setInput(value)}
            onSubmit={handleSubmit}
          />
        </Card>

        <div className="space-y-6">
          <TestWorkflow messageToTest={lastUserMessage} />
        </div>
      </div>
    </div>
  );
};

export default AiChat;