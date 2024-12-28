import { Card } from "@/components/ui/card";
import { TestResults } from '../types/test-results';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

interface DetailedMetricsProps {
  results: TestResults;
  showComparison?: boolean;
  previousResults?: TestResults;
}

export const DetailedMetrics = ({ 
  results, 
  showComparison, 
  previousResults 
}: DetailedMetricsProps) => {
  const getPercentageChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <p className="text-sm font-medium">Engagement</p>
        </div>
        <p className="text-2xl font-bold">{(results.engagement * 100).toFixed(1)}%</p>
        {showComparison && previousResults && (
          <p className="text-sm text-muted-foreground mt-1">
            {getPercentageChange(results.engagement, previousResults.engagement)}% vs précédent
          </p>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-green-500" />
          <p className="text-sm font-medium">Taux de clic</p>
        </div>
        <p className="text-2xl font-bold">{(results.clickRate * 100).toFixed(1)}%</p>
        {showComparison && previousResults && (
          <p className="text-sm text-muted-foreground mt-1">
            {getPercentageChange(results.clickRate, previousResults.clickRate)}% vs précédent
          </p>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-purple-500" />
          <p className="text-sm font-medium">Conversion</p>
        </div>
        <p className="text-2xl font-bold">{(results.conversionRate * 100).toFixed(1)}%</p>
        {showComparison && previousResults && (
          <p className="text-sm text-muted-foreground mt-1">
            {getPercentageChange(results.conversionRate, previousResults.conversionRate)}% vs précédent
          </p>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-yellow-500" />
          <p className="text-sm font-medium">ROI estimé</p>
        </div>
        <p className="text-2xl font-bold">{(results.roi * 100).toFixed(1)}%</p>
        {showComparison && previousResults && (
          <p className="text-sm text-muted-foreground mt-1">
            {getPercentageChange(results.roi, previousResults.roi)}% vs précédent
          </p>
        )}
      </Card>
    </div>
  );
};