import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Rocket } from 'lucide-react';

interface TestRecommendationsProps {
  recommendations: string[];
  risks: string[];
  opportunities: string[];
}

export const TestRecommendations = ({ recommendations, risks, opportunities }: TestRecommendationsProps) => {
  if (!recommendations.length && !risks.length && !opportunities.length) return null;

  return (
    <Card className="p-4 space-y-4">
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recommandations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Risques identifiés</h4>
          <ul className="space-y-2">
            {risks.map((risk, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {opportunities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Opportunités</h4>
          <ul className="space-y-2">
            {opportunities.map((opportunity, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <Rocket className="h-4 w-4 text-green-500" />
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};