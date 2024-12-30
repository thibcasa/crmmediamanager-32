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
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-lg text-sage-600">
          Commencez une conversation en envoyant un message...
        </p>
      </div>
    );
  }

  const renderMessageContent = (content: string) => {
    if (!content) return null;
    
    try {
      const lines = content.split('\n');
      return lines.map((line, i) => (
        <p key={i} className="mb-4 last:mb-0 text-sage-700">{line}</p>
      ));
    } catch (error) {
      console.error("Error rendering message:", error);
      return <p className="text-sage-700">{content}</p>;
    }
  };

  return (
    <ScrollArea className="flex-1 px-6 py-8">
      <div className="space-y-8">
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
              className={`max-w-[85%] rounded-lg p-6 shadow-md relative group ${
                message.role === 'assistant'
                  ? 'bg-white border-2 border-sage-200'
                  : 'bg-sage-50 border border-sage-300'
              }`}
            >
              <p className="text-base font-semibold text-sage-800 mb-3">
                {message.role === 'assistant' ? 'Assistant Stratégique' : 'Vous'}
              </p>
              <div className="text-base leading-relaxed prose prose-sage max-w-none">
                {renderMessageContent(message.content)}
              </div>
              
              {message.role === 'assistant' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(message.content, index)}
                >
                  {copiedMessageIndex === index ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-sage-600" />
                  )}
                </Button>
              )}
            </div>
          </div>
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