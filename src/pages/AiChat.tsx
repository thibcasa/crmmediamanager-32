import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { ModuleContainer } from "@/components/ai-chat/modules/ModuleContainer";
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
          type: "campaign_response",
          text: `Campagne créée avec le persona "${result.selectedPersona.name}". Prochaines étapes : ${result.nextSteps.map(step => step.details).join(", ")}`,
          platform: "linkedin",
          targetAudience: "property_owners",
          location: "alpes_maritimes",
          propertyType: "luxury",
          metadata: {
            type: "campaign_response",
            platform: "linkedin",
            targetAudience: "property_owners",
            location: "alpes_maritimes",
            propertyType: "luxury",
            metrics: {
              engagement: 0,
              clicks: 0,
              conversions: 0,
              roi: 0
            }
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
      <div className="flex-1 overflow-hidden flex">
        <div className="w-2/3 flex flex-col">
          <ChatMessages messages={messages} isLoading={isProcessing} />
          <ChatInput
            input={input}
            isLoading={isProcessing}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="w-1/3 border-l border-gray-200">
          <ModuleContainer />
        </div>
      </div>
    </div>
  );
};

export default AiChat;