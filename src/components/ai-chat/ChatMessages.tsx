import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  return (
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
  );
};