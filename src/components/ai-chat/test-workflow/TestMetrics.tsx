import { Card } from "@/components/ui/card";
import { TestResults } from './types';

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
        <p className="text-sm font-medium">Coût par acquisition</p>
        <p className="text-2xl font-bold">{results.cpa}€</p>
      </Card>
      <Card className="p-4">
        <p className="text-sm font-medium">ROI estimé</p>
        <p className="text-2xl font-bold">{(results.roi * 100).toFixed(1)}%</p>
      </Card>
    </div>
  );
};