import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Platform } from '@/services/SocialCampaignService';
import { useAIOrchestrator } from '@/components/ai-chat/AIOrchestrator';
import { 
  LinkedinIcon, 
  InstagramIcon, 
  Target, 
  Users, 
  MessageSquare, 
  Image as ImageIcon,
  Rocket,
  BarChart
} from 'lucide-react';

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
        <TabsList className="grid w-full grid-cols-4 mb-8">
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
        </TabsList>

        <TabsContent value="step1" className="space-y-6">
          <h3 className="text-lg font-medium text-sage-800">Choisir la plateforme de diffusion</h3>
          <div className="grid grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              onClick={() => handlePlatformSelect('linkedin')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <LinkedinIcon className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">LinkedIn</div>
                <div className="text-sm text-sage-600">Prospection B2B ciblée</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handlePlatformSelect('instagram')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <InstagramIcon className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">Instagram</div>
                <div className="text-sm text-sage-600">Visibilité locale maximale</div>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step2" className="space-y-6">
          <h3 className="text-lg font-medium text-sage-800">Définir votre stratégie d'approche</h3>
          <div className="grid grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              onClick={() => handleStrategySelect('prospection')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <Target className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">Prospection directe</div>
                <div className="text-sm text-sage-600">Contact personnalisé avec les propriétaires</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleStrategySelect('branding')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <BarChart className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">Image de marque</div>
                <div className="text-sm text-sage-600">Développement de votre expertise</div>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step3" className="space-y-6">
          <h3 className="text-lg font-medium text-sage-800">Choisir le format de contenu</h3>
          <div className="grid grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              onClick={() => handleFormatSelect('text')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <MessageSquare className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">Message texte</div>
                <div className="text-sm text-sage-600">Communication directe et personnalisée</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleFormatSelect('image')}
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-sage-50 hover:border-sage-500 transition-all"
            >
              <ImageIcon className="w-8 h-8 text-sage-600" />
              <div className="text-center">
                <div className="font-medium mb-1">Image + Texte</div>
                <div className="text-sm text-sage-600">Impact visuel maximal</div>
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step4" className="space-y-6">
          <h3 className="text-lg font-medium text-sage-800">Vérifier et lancer la campagne</h3>
          <div className="space-y-6">
            <Card className="p-6 bg-sage-50 border-sage-200">
              <h4 className="font-medium text-sage-800 mb-4">Récapitulatif de la configuration</h4>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-sage-600">Plateforme</dt>
                  <dd className="font-medium text-sage-800 mt-1">{config.platform}</dd>
                </div>
                <div>
                  <dt className="text-sm text-sage-600">Stratégie</dt>
                  <dd className="font-medium text-sage-800 mt-1">{config.strategy}</dd>
                </div>
                <div>
                  <dt className="text-sm text-sage-600">Format</dt>
                  <dd className="font-medium text-sage-800 mt-1">{config.format}</dd>
                </div>
                <div>
                  <dt className="text-sm text-sage-600">Cible</dt>
                  <dd className="font-medium text-sage-800 mt-1">{config.targetAudience}</dd>
                </div>
              </dl>
            </Card>
            <Button 
              onClick={handleLaunchCampaign}
              disabled={isProcessing}
              className="w-full h-12 bg-sage-600 hover:bg-sage-700 text-white flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              {isProcessing ? "Création en cours..." : "Lancer la campagne"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};