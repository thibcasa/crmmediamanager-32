import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { AIService } from "@/services/AIService";
import { useState } from "react";
import { LinkedInStatus } from "@/components/linkedin/LinkedInStatus";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { useAIOrchestrator } from "@/components/ai-chat/AIOrchestrator";
import { getSystemPrompt } from "@/components/ai-chat/AISystemPrompt";

const SUPPORTED_PLATFORMS = ['linkedin', 'facebook', 'instagram', 'whatsapp'];

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { executeWorkflow } = useAIOrchestrator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await AIService.generateContent('description', `${getSystemPrompt()}\n\nObjectif: ${userMessage}`);
      
      const assistantMessage = typeof response === 'string' ? response : 
        (response?.content ? response.content : JSON.stringify(response));
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Exécuter le workflow pour chaque plateforme
      for (const platform of SUPPORTED_PLATFORMS) {
        console.log(`Executing workflow for ${platform}`);
        await executeWorkflow(assistantMessage, platform);
      }

    } catch (error) {
      console.error("Error generating strategy:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-sage-900">
            Assistant Stratégique Immobilier Multi-Réseaux
          </h1>
          <p className="text-sage-600 mt-3 text-lg">
            Je coordonne vos stratégies de prospection sur tous les réseaux sociaux et génère du contenu adapté
          </p>
        </div>

        <Card className="p-6 bg-white shadow-sm border-sage-200">
          <h2 className="text-xl font-semibold text-sage-800 mb-4">Statut des connexions</h2>
          <LinkedInStatus />
          {/* Ajouter ici les statuts des autres réseaux sociaux quand disponibles */}
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
      </div>
    </AppLayout>
  );
};

export default AiChat;
