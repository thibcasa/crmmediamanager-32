import { Card } from "@/components/ui/card";
import { TestResults } from "../../types/test-results";
import { MetricsGrid } from "../metrics/MetricsGrid";
import { useMetricsAnalysis } from "../../hooks/useMetricsAnalysis";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TestDashboardProps {
  currentResults: TestResults;
  previousResults?: TestResults;
}

export const TestDashboard = ({ currentResults, previousResults }: TestDashboardProps) => {
  const { improvement, readyForProduction, metrics } = useMetricsAnalysis(currentResults, previousResults);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tableau de bord des tests</h3>
        {improvement !== 0 && (
          <div className="flex items-center gap-2">
            {improvement > 0 ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(improvement).toFixed(1)}% par rapport au test précédent
            </span>
          </div>
        )}
      </div>

      <MetricsGrid results={currentResults} />

      {readyForProduction && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <p className="text-green-800 text-sm">
            Les métriques ont atteint les seuils requis pour la mise en production !
          </p>
        </div>
      )}
    </Card>
  );
};