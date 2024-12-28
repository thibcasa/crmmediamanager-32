import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Wrench, TestTube, Rocket } from 'lucide-react';

interface CampaignTabsProps {
  canProceedToProduction: boolean;
}

export const CampaignTabs = ({ canProceedToProduction }: CampaignTabsProps) => {
  return (
    <TabsList className="grid grid-cols-4 w-full">
      <TabsTrigger value="prediction" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        Prédiction
      </TabsTrigger>
      <TabsTrigger value="correction" className="flex items-center gap-2">
        <Wrench className="h-4 w-4" />
        Correction
      </TabsTrigger>
      <TabsTrigger value="test" className="flex items-center gap-2">
        <TestTube className="h-4 w-4" />
        Test
      </TabsTrigger>
      <TabsTrigger 
        value="production" 
        className="flex items-center gap-2"
        disabled={!canProceedToProduction}
      >
        <Rocket className="h-4 w-4" />
        Production
      </TabsTrigger>
    </TabsList>
  );
};