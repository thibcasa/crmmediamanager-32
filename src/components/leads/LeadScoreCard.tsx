import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertCircle } from "lucide-react";

interface LeadScoreCardProps {
  score: number;
  aiConfidence: number;
  corrections?: Record<string, any>;
}

export const LeadScoreCard = ({ score, aiConfidence, corrections }: LeadScoreCardProps) => {
  const scoreColor = score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Score du Lead</CardTitle>
        <Brain className="h-5 w-5 text-sage-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Score Global</span>
            <span className={`text-2xl font-bold ${scoreColor}`}>{score}/100</span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sage-500" />
            <span className="text-sm text-muted-foreground">
              Confiance IA: {aiConfidence}%
            </span>
          </div>

          {corrections && Object.keys(corrections).length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Corrections suggérées:</span>
              </div>
              <ul className="text-sm space-y-1">
                {Object.entries(corrections).map(([field, value]) => (
                  <li key={field} className="text-muted-foreground">
                    {field}: {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};