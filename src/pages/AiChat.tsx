import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { useChat } from "@/hooks/use-chat";
import { Card } from "@/components/ui/card";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleContainer } from "@/components/ai-chat/modules/ModuleContainer";
import { CreativesModule } from "@/components/ai-chat/modules/CreativesModule";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";

const AiChat = () => {
  useSessionCheck();
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const { moduleStates } = useAIOrchestrator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-sage-800 mb-2">
          Assistant Marketing Immobilier
        </h1>
        <p className="text-sage-600 mb-4">
          Je suis votre assistant spécialisé dans le marketing immobilier de luxe sur la Côte d'Azur.
          Je peux vous aider à créer du contenu, analyser vos performances et optimiser vos stratégies.
        </p>
      </Card>

      <Tabs defaultValue="chat" className="flex-1">
        <TabsList>
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="creatives">Créatives</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
          <ExamplePrompts onPromptClick={handleExampleClick} />
          
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-sage-200 flex flex-col">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModuleContainer moduleType="subject" />
            <ModuleContainer moduleType="title" />
            <ModuleContainer moduleType="content" />
            <ModuleContainer moduleType="creative" />
            <ModuleContainer moduleType="workflow" />
            <ModuleContainer moduleType="pipeline" />
            <ModuleContainer moduleType="predictive" />
            <ModuleContainer moduleType="correction" />
          </div>
        </TabsContent>

        <TabsContent value="creatives">
          <CreativesModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;