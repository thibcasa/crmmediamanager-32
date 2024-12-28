import { Card } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Rocket, CheckCircle } from 'lucide-react';
import { TestResults } from '../types/test-results';

interface TestRecommendationsProps {
  results: TestResults;
  previousResults?: TestResults;
}

export const TestRecommendations = ({ results, previousResults }: TestRecommendationsProps) => {
  const getRecommendations = () => {
    const recommendations = [];
    
    if (results.engagement < 0.4) {
      recommendations.push("Optimisez le contenu pour augmenter l'engagement");
    }
    
    if (results.conversionRate < 0.1) {
      recommendations.push("Renforcez les appels à l'action");
    }
    
    if (results.roi < 2) {
      recommendations.push("Améliorez le ciblage pour augmenter le ROI");
    }

    return recommendations;
  };

  const getOpportunities = () => {
    const opportunities = [];
    
    if (results.engagement > previousResults?.engagement) {
      opportunities.push("Le taux d'engagement est en hausse, continuez sur cette lancée");
    }
    
    if (results.roi > 2.5) {
      opportunities.push("Le ROI est excellent, envisagez d'augmenter le budget");
    }

    return opportunities;
  };

  const getRisks = () => {
    const risks = [];
    
    if (results.engagement < previousResults?.engagement) {
      risks.push("Baisse de l'engagement, revoyez le contenu");
    }
    
    if (results.roi < 1) {
      risks.push("ROI négatif, optimisation urgente nécessaire");
    }

    return risks;
  };

  const recommendations = getRecommendations();
  const opportunities = getOpportunities();
  const risks = getRisks();

  if (!recommendations.length && !opportunities.length && !risks.length) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <p className="text-sm">Aucune recommandation nécessaire, les métriques sont optimales.</p>
        </div>
      </Card>
    );
  }

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