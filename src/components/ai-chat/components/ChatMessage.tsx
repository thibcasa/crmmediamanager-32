import { Message } from '../types/chat';
import { StructuredContentDisplay } from './StructuredContent';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  index: number;
  copiedMessageIndex: number | null;
  onCopy: (content: string | object, index: number) => void;
}

export const ChatMessage = ({ message, index, copiedMessageIndex, onCopy }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';
  const isCopied = copiedMessageIndex === index;

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${isAssistant ? 'bg-sage-50' : 'bg-sage-100'} rounded-lg p-4`}>
        {typeof message.content === 'string' ? (
          <div className="prose max-w-none">
            <p className="text-base text-gray-700">{message.content}</p>
          </div>
        ) : (
          <StructuredContentDisplay content={message.content} />
        )}
        
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-sage-600 hover:text-sage-700"
            onClick={() => onCopy(message.content, index)}
          >
            {isCopied ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};