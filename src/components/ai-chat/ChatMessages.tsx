import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, User } from "lucide-react";
import { Message } from './types/chat';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  if (!messages.length && !isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-lg text-sage-600">
          Commencez une conversation en décrivant votre objectif marketing...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-6 py-8">
      <div className="space-y-8">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                message.role === "assistant" ? "bg-sage-100" : "bg-sage-600"
              }`}
            >
              {message.role === "assistant" ? (
                <Brain className="h-5 w-5 text-sage-600" />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div
              className={`flex-1 p-4 rounded-lg ${
                message.role === "assistant"
                  ? "bg-sage-50 text-sage-900"
                  : "bg-sage-600 text-white"
              }`}
            >
              {typeof message.content === "string" ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(message.content, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-3 text-sage-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-base">Génération de la réponse...</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};