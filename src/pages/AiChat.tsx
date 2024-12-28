import { useState } from "react";
import { useMonitoring } from "@/monitoring/hooks/useMonitoring";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useChat } from "@/hooks/use-chat";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChat = () => {
  const { trackError, trackEvent } = useMonitoring({
    componentName: 'AiChat',
    enableAutoCorrect: true
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      trackEvent('message_sent', { content_length: input.length });
      
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);

      const response = await sendMessage(input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setInput("");
      trackEvent('message_received', { response_length: response.message.length });
    } catch (error) {
      await handleError(error as Error);
    }
  };

  const handleError = async (error: Error) => {
    await trackError(error, {
      context: 'ai_chat_page',
      severity: 'high'
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col min-h-0">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput 
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default AiChat;