import { Card } from "@/components/ui/card";
import { TestResults } from './types/test-results';
import { MetricsGrid } from './components/metrics/MetricsGrid';

interface TestMetricsProps {
  results: TestResults;
  previousResults?: TestResults;
}

export const TestMetrics = ({ results, previousResults }: TestMetricsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Métriques de Performance</h4>
      <MetricsGrid results={results} previousResults={previousResults} />
    </div>
  );
};