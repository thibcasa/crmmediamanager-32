import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

interface AIRecommendation {
  type: string;
  description: string;
  priority: string;
}

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
}

export const AIRecommendations = ({ recommendations }: AIRecommendationsProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recommandations IA</h3>
        <Sparkles className="w-5 h-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {recommendations?.map((action, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{action.type}</p>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
            <Badge variant="outline">
              Priorité: {action.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};