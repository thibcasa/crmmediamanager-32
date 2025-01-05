import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatDisplay } from "@/components/ai-chat/ChatDisplay";
import { useChat } from "@/hooks/use-chat";
import { Card } from "@/components/ui/card";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleContainer } from "@/components/ai-chat/modules/ModuleContainer";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { Brain, MessageSquare, Target, BarChart } from "lucide-react";
import { AIPerformanceStats } from "@/components/ai-chat/monitoring/AIPerformanceStats";
import { AIFeedbackForm } from "@/components/ai-chat/monitoring/AIFeedbackForm";
import { toast } from "@/components/ui/use-toast";

const AiChat = () => {
  useSessionCheck();
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const { moduleStates } = useAIOrchestrator();
  const [showPerformance, setShowPerformance] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    try {
      console.log("Envoi du message:", input);
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 space-y-4">
      <Card className="p-6 bg-gradient-to-r from-sage-50 to-sage-100">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-sage-600" />
          <div>
            <h1 className="text-2xl font-bold text-sage-800">
              Assistant Marketing Immobilier
            </h1>
            <p className="text-sage-600">
              Je suis votre assistant spécialisé dans le marketing immobilier de luxe sur la Côte d'Azur.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Performance IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4">
          <div className="flex-1 bg-white rounded-lg shadow-sm border border-sage-200 flex flex-col">
            <ChatDisplay messages={messages} />
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
              placeholder="Ex: Créer une campagne LinkedIn pour obtenir 4 mandats par semaine..."
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

        <TabsContent value="performance" className="space-y-4">
          <Card className="p-6">
            <AIPerformanceStats />
            <div className="mt-6">
              <AIFeedbackForm />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;