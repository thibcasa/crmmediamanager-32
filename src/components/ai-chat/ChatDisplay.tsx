import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Brain, User } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDisplayProps {
  messages: Message[];
}

export const ChatDisplay = ({ messages }: ChatDisplayProps) => {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4 p-4">
        {messages.map((message, index) => (
          <Card key={index} className={`p-4 ${message.role === 'assistant' ? 'bg-sage-50' : 'bg-white'}`}>
            <div className="flex items-start gap-3">
              {message.role === 'assistant' ? (
                <Brain className="h-6 w-6 text-sage-600 mt-1" />
              ) : (
                <User className="h-6 w-6 text-gray-600 mt-1" />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-800">{message.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};