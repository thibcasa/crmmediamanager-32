import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ModuleState, ModuleType } from '@/types/modules';

interface ModuleBaseProps {
  type: ModuleType;
  title: string;
  description: string;
  state: ModuleState;
  onValidate?: () => void;
}

export const ModuleBase = ({ type, title, description, state, onValidate }: ModuleBaseProps) => {
  const getModuleIcon = (status: ModuleState['status']) => {
    switch (status) {
      case 'validated':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      default:
        return <Brain className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getModuleIcon(state.status)}
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {(state.validationScore * 100).toFixed(0)}%
        </div>
      </div>

      <p className="text-sm text-gray-500">{description}</p>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Validation</span>
            <span>{(state.validationScore * 100).toFixed(0)}%</span>
          </div>
          <Progress value={state.validationScore * 100} />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Engagement</div>
            <div className="text-sm font-medium">
              {(state.predictions.engagement * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Conversion</div>
            <div className="text-sm font-medium">
              {(state.predictions.conversion * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">ROI</div>
            <div className="text-sm font-medium">
              {state.predictions.roi.toFixed(1)}x
            </div>
          </div>
        </div>

        {state.status === 'processing' && (
          <div className="flex items-center justify-center gap-2 text-xs text-blue-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Traitement en cours...</span>
          </div>
        )}
      </div>
    </Card>
  );
};