import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowState } from './hooks/useWorkflowState';
import { CampaignHeader } from './CampaignHeader';
import { CampaignPreview } from './CampaignPreview';
import { TestingDashboard } from './TestingDashboard';
import { ProductionDashboard } from './ProductionDashboard';
import { CreativeGenerator } from './CreativeGenerator';
import { ContentGenerator } from './ContentGenerator';
import { CampaignDashboard } from './CampaignDashboard';
import { CampaignData } from '../types/campaign';
import { LayoutGrid, Wand2, TestTube, BarChart2 } from 'lucide-react';

interface CampaignWorkflowManagerProps {
  initialData?: CampaignData;
  onUpdate?: (updates: Partial<CampaignData>) => void;
}

export const CampaignWorkflowManager = ({ initialData, onUpdate }: CampaignWorkflowManagerProps) => {
  const { state, actions } = useWorkflowState(initialData?.objective);
  const [activeTab, setActiveTab] = useState('workflow');

  const defaultCampaignData: CampaignData = {
    objective: initialData?.objective || '',
    creatives: initialData?.creatives || [],
    content: initialData?.content || [],
    predictions: initialData?.predictions || {
      engagement: 0,
      costPerLead: 0,
      roi: 0,
      estimatedLeads: 0
    }
  };

  const [campaignData, setCampaignData] = useState<CampaignData>(defaultCampaignData);

  const handleUpdate = (updates: Partial<CampaignData>) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
    onUpdate?.(updates);
  };

  return (
    <div className="space-y-6">
      <CampaignHeader iterationCount={state.iterationCount} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="generation" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Génération
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CreativeGenerator 
                onCreativesGenerated={(creatives) => handleUpdate({ creatives })}
                existingCreatives={campaignData.creatives}
              />
              <ContentGenerator 
                onContentGenerated={(content) => handleUpdate({ content })}
                existingContent={campaignData.content}
              />
            </div>
            <div className="space-y-6">
              <CampaignPreview 
                campaignData={campaignData}
                onUpdate={handleUpdate}
              />
              <TestingDashboard 
                campaignData={campaignData}
                onTestComplete={(predictions) => handleUpdate({ predictions })}
              />
              <ProductionDashboard 
                campaignData={campaignData}
                onLaunch={actions.handleProduction}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generation">
          <div className="space-y-6">
            <CreativeGenerator 
              onCreativesGenerated={(creatives) => handleUpdate({ creatives })}
              existingCreatives={campaignData.creatives}
            />
            <ContentGenerator 
              onContentGenerated={(content) => handleUpdate({ content })}
              existingContent={campaignData.content}
            />
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <div className="space-y-6">
            <TestingDashboard 
              campaignData={campaignData}
              onTestComplete={(predictions) => handleUpdate({ predictions })}
            />
            <ProductionDashboard 
              campaignData={campaignData}
              onLaunch={actions.handleProduction}
            />
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <CampaignDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};