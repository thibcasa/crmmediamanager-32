import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Rocket } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TestRecommendationsProps {
  recommendations: string[];
  risks?: string[];
  opportunities?: string[];
  onRecommendationClick: (recommendation: string) => void;
}

export const TestRecommendations = ({ 
  recommendations, 
  risks, 
  opportunities,
  onRecommendationClick 
}: TestRecommendationsProps) => {
  if (!recommendations.length && !risks?.length && !opportunities?.length) return null;

  const handleClick = (text: string, type: 'recommendation' | 'risk' | 'opportunity') => {
    onRecommendationClick(`${text} (Type: ${type})`);
  };

  return (
    <Card className="p-4 space-y-4">
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Recommandations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-orange-50"
                  onClick={() => handleClick(rec, 'recommendation')}
                >
                  <AlertCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                  <span className="text-left">{rec}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {risks && risks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Risques identifiés</h4>
          <ul className="space-y-2">
            {risks.map((risk, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-red-50"
                  onClick={() => handleClick(risk, 'risk')}
                >
                  <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                  <span className="text-left">{risk}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {opportunities && opportunities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Opportunités</h4>
          <ul className="space-y-2">
            {opportunities.map((opportunity, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm hover:bg-green-50"
                  onClick={() => handleClick(opportunity, 'opportunity')}
                >
                  <Rocket className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-left">{opportunity}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};