import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestResults } from '../types/test-results';

interface AnalyticsTabProps {
  testHistory: TestResults[];
  currentResults: TestResults;
}

export const AnalyticsTab = ({ testHistory, currentResults }: AnalyticsTabProps) => {
  if (testHistory.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Aucune donnée d'analyse disponible. Commencez par tester votre campagne.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <h4 className="text-lg font-medium mb-4">Analyse des Performances</h4>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm font-medium">Progression ROI</p>
            <p className="text-2xl font-bold">
              {(currentResults.roi * 100).toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm font-medium">Progression Engagement</p>
            <p className="text-2xl font-bold">
              {(currentResults.engagement * 100).toFixed(1)}%
            </p>
          </Card>
        </div>
        
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Historique des itérations</h5>
          {testHistory.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center">
                <span>Itération {index + 1}</span>
                <span className="text-sm text-muted-foreground">
                  ROI: {(result.roi * 100).toFixed(1)}% | 
                  Engagement: {(result.engagement * 100).toFixed(1)}%
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
};