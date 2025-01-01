import { useState } from "react";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { useChat } from "@/hooks/use-chat";
import { Card } from "@/components/ui/card";
import { useSessionCheck } from "@/hooks/useSessionCheck";

const AiChat = () => {
  useSessionCheck(); // Add session check
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChat();

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
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-sage-800 mb-2">
          Assistant Marketing Immobilier
        </h1>
        <p className="text-sage-600 mb-4">
          Je suis votre assistant spécialisé dans le marketing immobilier de luxe sur la Côte d'Azur.
          Je peux vous aider à créer du contenu, analyser vos performances et optimiser vos stratégies.
        </p>
      </Card>

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
    </div>
  );
};

export default AiChat;