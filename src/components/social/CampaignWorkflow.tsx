import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { PlatformSelector } from './PlatformSelector';
import { StrategySelector } from './StrategySelector';
import { SocialPlatform } from '@/types/social';

export const CampaignWorkflow = () => {
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const handlePlatformSelect = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setStep(2);
  };

  const handleStrategySelect = (strategy: string) => {
    setSelectedStrategy(strategy);
    setStep(3);
  };

  return (
    <Card className="p-6 space-y-8">
      {step === 1 && (
        <PlatformSelector onPlatformSelect={handlePlatformSelect} />
      )}
      
      {step === 2 && selectedPlatform && (
        <StrategySelector 
          platform={selectedPlatform} 
          onStrategySelect={handleStrategySelect}
        />
      )}
      
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Configuration terminée !</h2>
          <p className="text-muted-foreground mt-2">
            Plateforme : {selectedPlatform}<br />
            Stratégie : {selectedStrategy}
          </p>
        </div>
      )}
    </Card>
  );
};