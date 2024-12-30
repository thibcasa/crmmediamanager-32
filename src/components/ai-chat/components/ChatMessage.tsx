import { Message } from '../types/chat';
import { StructuredContent } from './StructuredContent';
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  index: number;
  copiedMessageIndex: number | null;
  onCopy: (content: string | object, index: number) => void;
}

export const ChatMessage = ({ message, index, copiedMessageIndex, onCopy }: ChatMessageProps) => {
  const renderMessageContent = (content: string | object) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      try {
        const lines = content.split('\n');
        return lines.map((line, i) => (
          <p key={i} className="mb-4 last:mb-0 text-sage-700">{line}</p>
        ));
      } catch (error) {
        console.error("Error rendering message:", error);
        return <p className="text-sage-700">{content}</p>;
      }
    }
    
    // Si c'est un objet structuré, on utilise le composant StructuredContent
    return <StructuredContent content={content as StructuredMessage} />;
  };

  return (
    <div
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
            onClick={() => onCopy(message.content, index)}
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
  );
};