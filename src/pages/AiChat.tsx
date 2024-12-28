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

  const handleSendMessage = async (content: string) => {
    try {
      trackEvent('message_sent', { content_length: content.length });
      
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);

      const response = await sendMessage(content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default AiChat;