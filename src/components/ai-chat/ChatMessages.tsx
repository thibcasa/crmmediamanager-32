import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const { toast } = useToast();
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
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
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-sage-600 text-sm">
          Commencez une conversation en envoyant un message...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.role === 'assistant'
                ? 'items-start'
                : 'items-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 shadow-sm relative group ${
                message.role === 'assistant'
                  ? 'bg-sage-50 border border-sage-200'
                  : 'bg-white border border-sage-200'
              }`}
            >
              <p className="text-sm font-medium text-sage-700 mb-2">
                {message.role === 'assistant' ? 'Assistant Stratégique' : 'Vous'}
              </p>
              <div className="text-sm prose prose-sage max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 text-sage-800">{line}</p>
                ))}
              </div>
              
              {message.role === 'assistant' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(message.content, index)}
                >
                  {copiedMessageIndex === index ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-sage-600" />
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-sage-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Génération de la stratégie...</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};