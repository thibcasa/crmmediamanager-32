import { Card } from "@/components/ui/card";
import { TestResults } from './test-workflow/types/test-results';

interface TestMetricsProps {
  results: TestResults;
}

export const TestMetrics = ({ results }: TestMetricsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4">
        <p className="text-sm font-medium">Engagement estimé</p>
        <p className="text-2xl font-bold">{(results.engagement * 100).toFixed(1)}%</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium">Taux de clic</p>
        <p className="text-2xl font-bold">{(results.clickRate * 100).toFixed(1)}%</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium">Taux de conversion</p>
        <p className="text-2xl font-bold">{(results.conversionRate * 100).toFixed(1)}%</p>
      </Card>
    </div>
  );
};