import { TestResults } from './test-workflow/types/test-results';
import { MetricsGrid } from './test-workflow/components/metrics/MetricsGrid';

interface TestMetricsProps {
  results: TestResults;
}

export const TestMetrics = ({ results }: TestMetricsProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Métriques de Performance</h4>
      <MetricsGrid results={results} />
    </div>
  );
};