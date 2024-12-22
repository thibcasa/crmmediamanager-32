import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/AIService";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

const EXAMPLE_PROMPTS = [
  "Crée une campagne Instagram Reels pour obtenir 8 mandats de vente cette semaine dans les Alpes-Maritimes",
  "Génère un workflow complet pour le suivi des leads immobiliers",
  "Propose un template d'email pour relancer les propriétaires après une première prise de contact",
  "Suggère des idées de contenu créatif pour TikTok ciblant les propriétaires",
];

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Tu es un expert en marketing immobilier spécialisé dans la région des Alpes-Maritimes. 
      Tu aides les agents immobiliers à créer des campagnes marketing efficaces, à mettre en place des workflows 
      et à générer du contenu créatif pour obtenir des mandats de vente. Sois précis et donne des exemples concrets.`;
      
      const response = await AIService.generateContent('description', `${systemPrompt}\n\nQuestion: ${userMessage}`);
      const assistantMessage = typeof response === 'string' ? response : JSON.stringify(response);
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer une réponse pour le moment.",
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
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Assistant Marketing Immobilier</h1>
          <p className="text-muted-foreground mt-2">
            Je vous aide à créer des campagnes marketing efficaces pour obtenir des mandats
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-4 text-left"
              onClick={() => handleExampleClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>

        <Card className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'assistant'
                    ? 'bg-sage-50 rounded-lg p-3'
                    : 'bg-white border rounded-lg p-3'
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {message.role === 'assistant' ? 'Assistant Marketing' : 'Vous'}
                </p>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-sage-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Génération de la réponse...</p>
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