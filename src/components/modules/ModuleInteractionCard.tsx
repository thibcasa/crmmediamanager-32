import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { ModuleState, ModuleType } from "@/types/modules";

interface ModuleInteractionCardProps {
  type: ModuleType;
  state: ModuleState;
  name: string;
  description: string;
  requiredScore: number;
}

export const ModuleInteractionCard = ({
  type,
  state,
  name,
  description,
  requiredScore
}: ModuleInteractionCardProps) => {
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

  const getMetricColor = (value: number) => {
    if (value >= 0.8) return 'text-green-500';
    if (value >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getModuleIcon(state.status)}
          <h3 className="font-medium">{name}</h3>
        </div>
        <div className="text-sm font-medium">
          Score: {(state.validationScore * 100).toFixed(0)}%
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      
      <div className="space-y-3">
        {/* Validation Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Validation</span>
            <span>{(state.validationScore * 100).toFixed(0)}%</span>
          </div>
          <Progress value={state.validationScore * 100} />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Engagement</div>
            <div className={`text-sm font-medium ${getMetricColor(state.predictions.engagement)}`}>
              {(state.predictions.engagement * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Conversion</div>
            <div className={`text-sm font-medium ${getMetricColor(state.predictions.conversion)}`}>
              {(state.predictions.conversion * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">ROI</div>
            <div className={`text-sm font-medium ${getMetricColor(state.predictions.roi)}`}>
              {state.predictions.roi.toFixed(1)}x
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {state.status === 'processing' && (
          <div className="flex items-center justify-center gap-2 text-xs text-blue-500 mt-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>
    </Card>
  );
};