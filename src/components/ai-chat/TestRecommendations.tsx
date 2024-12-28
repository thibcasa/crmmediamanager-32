import { Card } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

interface TestRecommendationsProps {
  recommendations: string[];
}

export const TestRecommendations = ({ recommendations }: TestRecommendationsProps) => {
  if (!recommendations.length) return null;

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-2">Recommandations</h4>
      <ul className="space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            {rec}
          </li>
        ))}
      </ul>
    </Card>
  );
};