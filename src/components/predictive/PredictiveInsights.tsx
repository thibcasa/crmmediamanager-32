import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PredictiveAnalysisService } from "@/services/ai/PredictiveAnalysisService";

export const PredictiveInsights = () => {
  const { data: insights } = useQuery({
    queryKey: ['predictive-insights'],
    queryFn: async () => {
      const data = await PredictiveAnalysisService.analyzeCampaignPerformance('insights');
      return data?.insights || [];
    }
  });

  if (!insights?.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Insights Prédictifs</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Catégorie</TableHead>
            <TableHead>Insight</TableHead>
            <TableHead>Impact</TableHead>
            <TableHead>Confiance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insights.map((insight: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{insight.category}</TableCell>
              <TableCell>{insight.description}</TableCell>
              <TableCell>
                <Badge 
                  variant={insight.impact >= 7 ? "default" : "secondary"}
                  className={
                    insight.impact >= 7 
                      ? "bg-green-500 hover:bg-green-600" 
                      : undefined
                  }
                >
                  {insight.impact}/10
                </Badge>
              </TableCell>
              <TableCell>{(insight.confidence * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};