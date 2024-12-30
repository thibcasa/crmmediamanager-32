import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { ModuleOrchestrator } from "@/components/ai-chat/modules/ModuleOrchestrator";
import { Message } from "@/components/ai-chat/types/chat";

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { executeWorkflow, isProcessing } = useAIOrchestrator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const result = await executeWorkflow(input);
      const aiMessage: Message = {
        role: "assistant",
        content: {
          type: "structured",
          text: result.response,
          platform: "linkedin",
          targetAudience: "property_owners",
          metadata: {
            type: "campaign_response",
            platform: "linkedin",
            targetAudience: "property_owners",
            metrics: result.metrics
          }
        }
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in workflow execution:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ModuleOrchestrator />
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} isLoading={isProcessing} />
        <ChatInput
          input={input}
          isLoading={isProcessing}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AiChat;