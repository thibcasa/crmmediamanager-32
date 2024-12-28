import { useState } from "react";
import { useMonitoring } from "@/monitoring/hooks/useMonitoring";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useChat } from "@/hooks/use-chat";
import { TestWorkflow } from "@/components/ai-chat/test-workflow/TestWorkflow";
import { CampaignWorkflowManager } from "@/components/ai-chat/campaign-workflow/CampaignWorkflowManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TestTube, Rocket, History } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("chat");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      trackEvent('message_sent', { content_length: input.length });
      
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setCurrentMessage(input);

      const response = await sendMessage(input);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setInput("");
      trackEvent('message_received', { response_length: response.message.length });
      
      // Automatically switch to test workflow after receiving response
      setActiveTab("test");
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
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Assistant Stratégique IA</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test & Validation
            </TabsTrigger>
            <TabsTrigger value="campaign" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Campagne
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="flex-1 flex flex-col min-h-[600px] bg-white rounded-lg shadow">
              <ChatMessages messages={messages} isLoading={isLoading} />
              <ChatInput 
                input={input}
                isLoading={isLoading}
                onInputChange={setInput}
                onSubmit={handleSendMessage}
              />
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            {currentMessage && (
              <TestWorkflow messageToTest={currentMessage} />
            )}
          </TabsContent>

          <TabsContent value="campaign" className="space-y-6">
            {currentMessage && (
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
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Historique des Campagnes</h3>
              <p className="text-sm text-muted-foreground">
                Visualisez l'historique de vos campagnes et leurs performances
              </p>
              {/* We'll implement the campaign history view in the next iteration */}
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AiChat;