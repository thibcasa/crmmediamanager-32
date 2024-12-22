import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/AIService";
import { Send } from "lucide-react";
import { useState } from "react";

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
      const response = await AIService.generateContent('description', userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
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

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Chat IA</h1>
          <p className="text-muted-foreground mt-2">
            Discutez avec notre assistant IA spécialisé en immobilier
          </p>
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
                  {message.role === 'assistant' ? 'Assistant' : 'Vous'}
                </p>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-sage-50 rounded-lg p-3 animate-pulse">
                <p className="text-sm">L'assistant réfléchit...</p>
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={isLoading}
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