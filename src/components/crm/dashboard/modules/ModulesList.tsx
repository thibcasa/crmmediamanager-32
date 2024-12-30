import { Card } from "@/components/ui/card";
import { SocialCampaign } from "@/types/social";
import { CheckCircle, XCircle } from "lucide-react";

interface ModulesListProps {
  campaigns: SocialCampaign[];
}

export const ModulesList = ({ campaigns }: ModulesListProps) => {
  const modules = [
    { id: 'subject', name: 'Module Sujet' },
    { id: 'title', name: 'Module Titre' },
    { id: 'content', name: 'Module Rédaction' },
    { id: 'creative', name: 'Module Créatif' },
    { id: 'workflow', name: 'Module Workflow' },
    { id: 'pipeline', name: 'Module Pipeline' }
  ];

  const getModuleStatus = (campaign: SocialCampaign, moduleId: string) => {
    const performance = campaign.ai_feedback?.performance_score || 0;
    return performance > 0.8;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">État des modules</h3>
      
      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <h4 className="font-medium mb-4">{campaign.name}</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-sm">{module.name}</span>
                  {getModuleStatus(campaign, module.id) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};