import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from './types/chat';
import { ChatMessage } from './components/ChatMessage';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const { toast } = useToast();
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  const handleCopy = async (content: string | object, index: number) => {
    try {
      const textContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      await navigator.clipboard.writeText(textContent);
      setCopiedMessageIndex(index);
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers",
      });
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  if (!messages.length && !isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-lg text-sage-600">
          Commencez une conversation en envoyant un message...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 py-8">
      <div className="space-y-8">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            index={index}
            copiedMessageIndex={copiedMessageIndex}
            onCopy={handleCopy}
          />
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-3 text-sage-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-base">Génération de la stratégie...</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};