import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Platform } from '@/services/SocialCampaignService';
import { useAIOrchestrator } from '@/components/ai-chat/AIOrchestrator';
import { Target, Users, MessageSquare, Rocket, Beaker } from 'lucide-react';
import { PlatformStep } from './steps/PlatformStep';
import { StrategyStep } from './steps/StrategyStep';
import { FormatStep } from './steps/FormatStep';
import { LaunchStep } from './steps/LaunchStep';
import { TestCellPreview } from '../test-cell/TestCellPreview';

interface StepConfig {
  platform: Platform;
  strategy: string;
  format: string;
}

export const WorkflowSteps = () => {
  const { toast } = useToast();
  const { executeWorkflow, isProcessing } = useAIOrchestrator();
  const [currentStep, setCurrentStep] = useState('step1');
  const [config, setConfig] = useState<StepConfig>({
    platform: 'linkedin',
    strategy: '',
    format: ''
  });

  const handlePlatformSelect = (platform: Platform) => {
    setConfig(prev => ({ ...prev, platform }));
    setCurrentStep('step2');
  };

  const handleStrategySelect = (strategy: string) => {
    setConfig(prev => ({ ...prev, strategy }));
    setCurrentStep('step3');
  };

  const handleFormatSelect = (format: string) => {
    setConfig(prev => ({ ...prev, format }));
    setCurrentStep('step4');
  };

  const handleLaunchCampaign = async () => {
    try {
      const prompt = `Créer une campagne ${config.strategy} pour ${config.platform} 
        avec le format ${config.format} ciblant les propriétaires à Nice`;
      
      await executeWorkflow(prompt, config.platform);
      
      toast({
        title: "Succès",
        description: "Campagne créée et programmée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors du lancement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="step1" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Plateforme
          </TabsTrigger>
          <TabsTrigger value="step2" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Stratégie
          </TabsTrigger>
          <TabsTrigger value="step3" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Format
          </TabsTrigger>
          <TabsTrigger value="step4" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Lancement
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="step1">
          <PlatformStep onPlatformSelect={handlePlatformSelect} />
        </TabsContent>

        <TabsContent value="step2">
          <StrategyStep 
            platform={config.platform} 
            onStrategySelect={handleStrategySelect}
          />
        </TabsContent>

        <TabsContent value="step3">
          <FormatStep onFormatSelect={handleFormatSelect} />
        </TabsContent>

        <TabsContent value="step4">
          <LaunchStep 
            config={config}
            onLaunch={handleLaunchCampaign}
            isProcessing={isProcessing}
          />
        </TabsContent>

        <TabsContent value="test">
          <TestCellPreview />
        </TabsContent>
      </Tabs>
    </Card>
  );
};