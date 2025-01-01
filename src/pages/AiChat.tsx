import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { ModuleContainer } from "@/components/ai-chat/modules/ModuleContainer";
import { Message } from "@/components/ai-chat/types/chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleType } from "@/types/modules";
import { CreativesModule } from "@/components/ai-chat/modules/CreativesModule";
import { ContentModule } from "@/components/ai-chat/modules/ContentModule";
import { toast } from "@/components/ui/use-toast";

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<ModuleType | "chat">("chat");
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
      
      // Create AI response message with workflow results
      const aiMessage: Message = {
        role: "assistant",
        content: {
          type: "campaign_response",
          text: `Workflow executed successfully. Check the modules tab to see the results.`,
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
              engagement: result.content?.predictions?.engagement || 0,
              clicks: 0,
              conversions: 0,
              roi: result.content?.predictions?.roi || 0
            }
          }
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Workflow completed",
        description: "All modules have been executed successfully",
      });
    } catch (error) {
      console.error("Error in workflow execution:", error);
      toast({
        title: "Error",
        description: "An error occurred while executing the workflow",
        variant: "destructive"
      });
    }
  };

  const renderModuleContent = (moduleType: ModuleType | "chat") => {
    switch (moduleType) {
      case "creative":
        return <CreativesModule />;
      case "content":
        return <ContentModule />;
      case "chat":
        return (
          <>
            <ChatMessages messages={messages} isLoading={isProcessing} />
            <ChatInput
              input={input}
              isLoading={isProcessing}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </>
        );
      default:
        return <ModuleContainer />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ModuleType | "chat")} className="flex-1">
        <TabsList className="grid grid-cols-10 w-full">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="subject">Sujet</TabsTrigger>
          <TabsTrigger value="title">Titre</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="creative">Créatif</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="predictive">Prédictif</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="correction">Correction</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="flex-1 flex flex-col">
              {renderModuleContent(activeTab)}
            </div>
            {activeTab !== "chat" && (
              <div className="w-1/3 border-l border-gray-200">
                <ModuleContainer moduleType={activeTab as ModuleType} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;
