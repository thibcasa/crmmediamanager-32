import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useWorkflowState } from './hooks/useWorkflowState';
import { CampaignHeader } from './CampaignHeader';
import { CampaignPreview } from './CampaignPreview';
import { TestingDashboard } from './TestingDashboard';
import { ProductionDashboard } from './ProductionDashboard';
import { CreativeGenerator } from './CreativeGenerator';
import { ContentGenerator } from './ContentGenerator';
import { CampaignData } from '../types/campaign';

interface CampaignWorkflowManagerProps {
  initialData?: CampaignData;
  onUpdate?: (updates: Partial<CampaignData>) => void;
}

export const CampaignWorkflowManager = ({ initialData, onUpdate }: CampaignWorkflowManagerProps) => {
  const { state, actions } = useWorkflowState(initialData?.objective);

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
    </div>
  );
};