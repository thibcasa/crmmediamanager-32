import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIOptimizationService } from '../optimization/AIOptimizationService';
import { useToast } from "@/hooks/use-toast";

export const AIPerformanceMonitor = ({ campaignId }: { campaignId: string }) => {
  const [performance, setPerformance] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const monitorPerformance = async () => {
      try {
        const data = await AIOptimizationService.analyzePerformance(campaignId);
        setPerformance(data);

        if (data.needsOptimization) {
          const improvements = await AIOptimizationService.generateImprovements(
            campaignId,
            data
          );

          toast({
            title: "Optimisations suggérées",
            description: "Des améliorations ont été identifiées pour votre campagne",
          });
        }
      } catch (error) {
        console.error('Error monitoring performance:', error);
      }
    };

    const interval = setInterval(monitorPerformance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [campaignId]);

  if (!performance) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Performance de la campagne</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Engagement</span>
            <span>{performance.engagement}%</span>
          </div>
          <Progress value={performance.engagement} />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Conversion</span>
            <span>{performance.conversion}%</span>
          </div>
          <Progress value={performance.conversion} />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>ROI</span>
            <span>{performance.roi}x</span>
          </div>
          <Progress value={performance.roi * 20} />
        </div>
      </div>
    </Card>
  );
};