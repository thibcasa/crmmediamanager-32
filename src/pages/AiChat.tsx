import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { Message } from "@/components/ai-chat/types/chat";
import { AIStrategyProvider } from "@/components/ai-chat/strategy/AIStrategyContext";
import { Card } from "@/components/ui/card";

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Process the message and get AI response
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing message:", error);
      setIsLoading(false);
    }
  };

  return (
    <AIStrategyProvider>
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </AIStrategyProvider>
  );
}