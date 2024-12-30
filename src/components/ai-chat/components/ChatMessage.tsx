import { Message } from '../types/chat';
import { StructuredContentDisplay } from './StructuredContent';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  index: number;
  copiedMessageIndex: number | null;
  onCopy: (content: string | object, index: number) => void;
}

export const ChatMessage = ({ message, index, copiedMessageIndex, onCopy }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const copied = copiedMessageIndex === index;

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      isUser ? "bg-sage-50" : "bg-white border border-sage-200"
    )}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {isUser ? 'Vous' : 'Assistant'}
          </span>
        </div>

        <div className="space-y-2">
          {typeof message.content === 'string' ? (
            <p className="text-gray-700">{message.content}</p>
          ) : (
            <StructuredContentDisplay content={message.content} />
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(message.content, index)}
        className="h-8 w-8 shrink-0"
      >
        {copied ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};