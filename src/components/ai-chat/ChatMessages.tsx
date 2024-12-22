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
              className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
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