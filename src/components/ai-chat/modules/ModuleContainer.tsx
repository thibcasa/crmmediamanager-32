import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleChat } from './ModuleChat';
import { ModuleResults } from './ModuleResults';
import { ModuleType } from '@/types/modules';
import { useAIOrchestrator } from '../AIOrchestrator';
import { toast } from "@/components/ui/use-toast";

interface ModuleContainerProps {
  moduleType: ModuleType;
}

export const ModuleContainer = ({ moduleType }: ModuleContainerProps) => {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);
  
  const { moduleStates, executeWorkflow } = useAIOrchestrator();
  const currentState = moduleStates[moduleType];

  if (!currentState) {
    console.error(`No state found for module type: ${moduleType}`);
    return (
      <Card className="p-4">
        <div className="text-red-500">
          Error: Module state not found
        </div>
      </Card>
    );
  }

  const handleMessage = async (message: string) => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await executeWorkflow(message);
      
      if (!response || !response[moduleType]) {
        throw new Error("Invalid response from workflow");
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response[moduleType].data?.response || 'Processing completed successfully'
      }]);
    } catch (error) {
      console.error('Error in module chat:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "An error occurred while processing your request"
      }]);
    }
  };

  return (
    <Card className="p-4">
      <Tabs defaultValue="results">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Résultats</TabsTrigger>
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          {currentState.data && (
            <ModuleResults 
              moduleType={moduleType} 
              result={{
                success: currentState.success,
                data: currentState.data,
                predictions: currentState.predictions,
                validationScore: currentState.validationScore
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="chat">
          <ModuleChat
            moduleType={moduleType}
            onMessage={handleMessage}
            messages={messages}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};