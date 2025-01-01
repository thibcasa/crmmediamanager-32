import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ModuleType } from '@/types/modules';
import { Send } from 'lucide-react';

interface ModuleChatProps {
  moduleType: ModuleType;
  onMessage: (message: string) => Promise<void>;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export const ModuleChat = ({ moduleType, onMessage, messages }: ModuleChatProps) => {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await onMessage(input);
      setInput('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'assistant' ? 'ml-4' : 'mr-4'
            }`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-primary/10'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur ce module..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};