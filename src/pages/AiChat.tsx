import { useState } from "react";
import { useMonitoring } from "@/monitoring/hooks/useMonitoring";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useChat } from "@/hooks/use-chat";
import { Card } from "@/components/ui/card";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";

const AiChat = () => {
  const { trackError, trackEvent } = useMonitoring({
    componentName: 'AiChat',
    enableAutoCorrect: true
  });

  const { messages, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      trackEvent('message_sent', { content_length: input.length });
      await sendMessage(input);
      setInput("");
      trackEvent('message_received');
    } catch (error) {
      await handleError(error as Error);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleError = async (error: Error) => {
    await trackError(error, {
      context: 'ai_chat_page',
      severity: 'high'
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Assistant Stratégique IA</h2>
        
        <ExamplePrompts onPromptClick={handlePromptClick} />
        
        <div className="flex-1 flex flex-col min-h-[600px] bg-white rounded-lg shadow">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSendMessage}
          />
        </div>
      </Card>
    </div>
  );
};

export default AiChat;