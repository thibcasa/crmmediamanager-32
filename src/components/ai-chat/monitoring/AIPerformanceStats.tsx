import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AIMonitoringService } from '@/services/ai/monitoring/AIMonitoringService';

export const AIPerformanceStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await AIMonitoringService.getFeedbackStats();
    if (data) setStats(data);
  };

  if (!stats) return null;

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-medium">Performances de l'IA</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Taux d'acceptation</span>
          <span>{stats.acceptanceRate.toFixed(1)}%</span>
        </div>
        <Progress value={stats.acceptanceRate} />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Performance par module</h4>
        {Array.from(stats.modulePerformance.entries()).map(([module, data]: [string, any]) => (
          <div key={module} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{module}</span>
              <span>{(data.accuracy * 100).toFixed(1)}%</span>
            </div>
            <Progress value={data.accuracy * 100} />
          </div>
        ))}
      </div>

      {stats.commonModifications.size > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Modifications fréquentes</h4>
          <ul className="text-sm space-y-1">
            {Array.from(stats.commonModifications.entries())
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([mod, count]) => (
                <li key={mod} className="flex justify-between">
                  <span>{mod}</span>
                  <span className="text-gray-500">{count}x</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Card>
  );
};