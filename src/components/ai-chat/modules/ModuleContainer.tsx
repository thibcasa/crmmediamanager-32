import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleChat } from './ModuleChat';
import { ModuleResults } from './ModuleResults';
import { ModuleType } from '@/types/modules';
import { useAIOrchestrator } from '../AIOrchestrator';

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

  const handleMessage = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await executeWorkflow(message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response[moduleType].data.response || 'Traitement effectué avec succès' 
      }]);
    } catch (error) {
      console.error('Error in module chat:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Une erreur est survenue lors du traitement de votre demande" 
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
                success: currentState.success || false,
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