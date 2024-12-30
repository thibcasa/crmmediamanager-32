import { Card } from "@/components/ui/card";
import { useModuleState } from "@/hooks/useModuleState";
import { ModuleState } from "@/types/social";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ModuleInteractionsProps {
  moduleId: string;
  campaignId: string;
  type: string;
}

export const ModuleInteractions = ({ moduleId, campaignId, type }: ModuleInteractionsProps) => {
  const { state, isLoading } = useModuleState(moduleId, campaignId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusIcon = (status: ModuleState['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      default:
        return <Brain className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(state?.status || 'idle')}
          <h3 className="font-medium">{type}</h3>
        </div>
        
        {state?.predictions && (
          <div className="text-sm text-muted-foreground">
            <div>Engagement: {state.predictions.engagement}%</div>
            <div>Conversion: {state.predictions.conversion}%</div>
            <div>ROI: {state.predictions.roi}x</div>
          </div>
        )}
      </div>

      {state?.data && (
        <div className="mt-4 text-sm">
          <pre className="bg-muted p-2 rounded-md overflow-auto">
            {JSON.stringify(state.data, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
};