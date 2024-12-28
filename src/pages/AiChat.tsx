import { useState } from "react";
import { useMonitoring } from "@/monitoring/hooks/useMonitoring";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useChat } from "@/hooks/use-chat";
import { TestWorkflow } from "@/components/ai-chat/test-workflow/TestWorkflow";
import { CampaignWorkflowManager } from "@/components/ai-chat/campaign-workflow/CampaignWorkflowManager";
import { Card } from "@/components/ui/card";

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
  const [currentMessage, setCurrentMessage] = useState<string | undefined>();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      trackEvent('message_sent', { content_length: input.length });
      
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setCurrentMessage(input); // Store current message for testing workflow

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
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex-1 flex flex-col min-h-[600px] bg-white rounded-lg shadow">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSendMessage}
          />
        </div>

        <div className="space-y-6">
          {currentMessage && (
            <>
              <TestWorkflow messageToTest={currentMessage} />
              <CampaignWorkflowManager 
                initialData={{
                  objective: currentMessage,
                  creatives: [],
                  content: [],
                  predictions: {
                    engagement: 0,
                    costPerLead: 0,
                    roi: 0,
                    estimatedLeads: 0
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiChat;