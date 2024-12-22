import { Card } from "@/components/ui/card";
import { AIService } from "@/services/AIService";
import { useState } from "react";
import { LinkedInStatus } from "@/components/linkedin/LinkedInStatus";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { getSystemPrompt } from "@/components/ai-chat/AISystemPrompt";
import { AIRecommendations } from "@/components/ai-chat/AIRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("chat");
  const { executeWorkflow } = useAIOrchestrator();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    console.log('Handling submit with message:', userMessage);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await AIService.generateContent(
        'description', 
        `${getSystemPrompt()}\n\nObjectif: ${userMessage}`
      );
      
      console.log('AI response received:', response);
      
      const assistantMessage = typeof response === 'string' ? response : 
        (response?.content ? response.content : JSON.stringify(response));
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      const platforms = ['linkedin', 'facebook', 'instagram', 'whatsapp'];
      
      for (const platform of platforms) {
        console.log(`Executing workflow for ${platform}`);
        try {
          await executeWorkflow(assistantMessage, platform);
          toast({
            title: `Campagne ${platform} créée`,
            description: "La campagne a été configurée avec succès"
          });
        } catch (error) {
          console.error(`Error executing workflow for ${platform}:`, error);
          toast({
            title: `Erreur - ${platform}`,
            description: `Une erreur est survenue lors de l'exécution du workflow pour ${platform}`,
            variant: "destructive"
          });
        }
      }

    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la stratégie",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-sage-900">
          Assistant Stratégique Immobilier Multi-Réseaux
        </h1>
        <p className="text-sage-600 mt-3 text-lg">
          Je coordonne vos stratégies de prospection sur tous les réseaux sociaux et génère du contenu adapté
        </p>
        {retryCount > 0 && (
          <p className="text-sage-500 mt-2">
            Tentative {retryCount}/{MAX_RETRIES}
          </p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations IA</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm border-sage-200">
            <h2 className="text-xl font-semibold text-sage-800 mb-4">Statut des connexions</h2>
            <LinkedInStatus />
          </Card>

          <ExamplePrompts onPromptClick={setInput} />

          <Card className="flex flex-col h-[600px] border-sage-200 shadow-sm overflow-hidden">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <ChatInput 
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-4">
          <AIRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;