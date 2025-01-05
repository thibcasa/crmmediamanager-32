import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DialogueFlow, MarketingStrategy } from '@/types/marketing';
import { ObjectiveInput } from './ObjectiveInput';
import { StrategyDisplay } from './StrategyDisplay';
import { ConversationFlow } from './ConversationFlow';
import { PerformanceMetrics } from './PerformanceMetrics';
import { MarketingStrategyEngine } from '@/services/marketing/MarketingStrategyEngine';
import { CampaignExecutor } from '@/services/marketing/CampaignExecutor';
import { PerformanceOptimizer } from '@/services/marketing/PerformanceOptimizer';

export const MarketingAIAssistant = () => {
  const [conversation, setConversation] = useState<DialogueFlow[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<MarketingStrategy | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<any>(null);
  const { toast } = useToast();

  const handleUserObjective = async (objective: string) => {
    try {
      const marketingAI = new MarketingStrategyEngine();
      const strategy = await marketingAI.createStrategy({
        target: 4,
        timeline: '1 month',
        type: 'mandate_generation'
      });

      const executor = new CampaignExecutor();
      const optimizer = new PerformanceOptimizer();

      setConversation(prev => [...prev, {
        role: 'assistant',
        content: `J'ai analysé votre objectif et créé une stratégie marketing adaptée. 
                 Voici ce que je propose...`,
        strategy
      }]);

      setCurrentStrategy(strategy);

      const campaign = await executor.executeCampaign(strategy);
      await optimizer.monitorAndOptimize(campaign);

      toast({
        title: "Stratégie générée avec succès",
        description: "La campagne a été lancée et est en cours d'optimisation",
      });
    } catch (error) {
      console.error('Error in handleUserObjective:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la stratégie",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <ObjectiveInput 
          onSubmit={handleUserObjective}
          placeholder="Quel est votre objectif commercial ?"
        />
        
        {currentStrategy && (
          <StrategyDisplay strategy={currentStrategy} />
        )}
        
        <ConversationFlow dialogue={conversation} />
        
        {currentMetrics && (
          <PerformanceMetrics metrics={currentMetrics} />
        )}
      </ScrollArea>
    </Card>
  );
};