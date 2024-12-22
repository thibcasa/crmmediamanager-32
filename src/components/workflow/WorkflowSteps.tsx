import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Platform } from '@/services/SocialCampaignService';
import { useAIOrchestrator } from '@/components/ai-chat/AIOrchestrator';

interface StepConfig {
  platform: Platform;
  strategy: string;
  format: string;
  targetAudience: string;
}

export const WorkflowSteps = () => {
  const { toast } = useToast();
  const { executeWorkflow, isProcessing } = useAIOrchestrator();
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<StepConfig>({
    platform: 'linkedin',
    strategy: 'prospection',
    format: 'text',
    targetAudience: 'propriétaires'
  });

  const handlePlatformSelect = (platform: Platform) => {
    setConfig(prev => ({ ...prev, platform }));
    setCurrentStep(2);
  };

  const handleStrategySelect = (strategy: string) => {
    setConfig(prev => ({ ...prev, strategy }));
    setCurrentStep(3);
  };

  const handleFormatSelect = (format: string) => {
    setConfig(prev => ({ ...prev, format }));
    setCurrentStep(4);
  };

  const handleLaunchCampaign = async () => {
    try {
      const prompt = `Créer une campagne ${config.strategy} pour ${config.platform} 
        ciblant les ${config.targetAudience} à Nice, format: ${config.format}`;
      
      await executeWorkflow(prompt, config.platform);
      
      toast({
        title: "Succès",
        description: "Campagne créée et programmée"
      });
    } catch (error) {
      console.error('Erreur lors du lancement:', error);
      
      if (error.message?.includes('Rate limit') || error.message?.includes('Max requests')) {
        toast({
          title: "Limite atteinte",
          description: "Veuillez patienter une minute avant de réessayer",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={`step${currentStep}`} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step1">Plateforme</TabsTrigger>
          <TabsTrigger value="step2">Stratégie</TabsTrigger>
          <TabsTrigger value="step3">Format</TabsTrigger>
          <TabsTrigger value="step4">Lancement</TabsTrigger>
        </TabsList>

        <TabsContent value="step1" className="space-y-4">
          <h3 className="text-lg font-medium">Choisir la plateforme</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handlePlatformSelect('linkedin')}
              className="h-24"
            >
              LinkedIn
              <br />
              Prospection B2B
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handlePlatformSelect('instagram')}
              className="h-24"
            >
              Instagram
              <br />
              Visibilité locale
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step2" className="space-y-4">
          <h3 className="text-lg font-medium">Définir la stratégie</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleStrategySelect('prospection')}
              className="h-24"
            >
              Prospection directe
              <br />
              Contacter des propriétaires
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleStrategySelect('branding')}
              className="h-24"
            >
              Image de marque
              <br />
              Visibilité et expertise
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step3" className="space-y-4">
          <h3 className="text-lg font-medium">Choisir le format</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={() => handleFormatSelect('text')}
              className="h-24"
            >
              Texte uniquement
              <br />
              Message personnalisé
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFormatSelect('image')}
              className="h-24"
            >
              Image + Texte
              <br />
              Impact visuel
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step4" className="space-y-4">
          <h3 className="text-lg font-medium">Lancer la campagne</h3>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium">Configuration</h4>
              <ul className="mt-2 space-y-2">
                <li>Plateforme: {config.platform}</li>
                <li>Stratégie: {config.strategy}</li>
                <li>Format: {config.format}</li>
                <li>Cible: {config.targetAudience}</li>
              </ul>
            </div>
            <Button 
              onClick={handleLaunchCampaign}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Création en cours..." : "Lancer la campagne"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};