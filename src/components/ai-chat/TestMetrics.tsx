import { Card } from "@/components/ui/card";
import { TestResults } from './test-workflow/types/test-results';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

interface TestMetricsProps {
  results: TestResults;
}

export const TestMetrics = ({ results }: TestMetricsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Métriques de Performance</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-medium">Engagement</p>
          </div>
          <p className="text-2xl font-bold">{(results.engagement * 100).toFixed(1)}%</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-green-500" />
            <p className="text-sm font-medium">Taux de clic</p>
          </div>
          <p className="text-2xl font-bold">{(results.clickRate * 100).toFixed(1)}%</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-medium">Conversion</p>
          </div>
          <p className="text-2xl font-bold">{(results.conversionRate * 100).toFixed(1)}%</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-yellow-500" />
            <p className="text-sm font-medium">ROI estimé</p>
          </div>
          <p className="text-2xl font-bold">{(results.roi * 100).toFixed(1)}%</p>
        </Card>
      </div>
    </div>
  );
};