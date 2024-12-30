import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { ModuleOrchestrator } from "@/components/ai-chat/modules/ModuleOrchestrator";
import { Message } from "@/components/ai-chat/types/chat";
import { Card } from "@/components/ui/card";

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { executeWorkflow, isProcessing, moduleStates, getModuleIcon } = useAIOrchestrator();

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
          text: `Campagne créée avec le persona "${result.selectedPersona.name}". Prochaines étapes : ${result.nextSteps.map(step => step.details).join(", ")}`,
          platform: "linkedin",
          targetAudience: "property_owners",
          metadata: {
            type: "campaign_response",
            platform: "linkedin",
            targetAudience: "property_owners",
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
      <Card className="p-4 mb-4 bg-white">
        <h2 className="text-xl font-semibold mb-4">État des Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(moduleStates).map(([type, state]) => (
            <Card key={type} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getModuleIcon(state.status)}
                <span className="capitalize">{type}</span>
              </div>
              <div className="text-sm text-gray-500">
                Score: {(state.validationScore * 100).toFixed(0)}%
              </div>
            </Card>
          ))}
        </div>
      </Card>
      
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