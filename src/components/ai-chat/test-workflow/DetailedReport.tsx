import { Card } from "@/components/ui/card";
import { TestResults } from "../types/test-results";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface DetailedReportProps {
  before: TestResults;
  after?: TestResults;
}

export const DetailedReport = ({ before, after }: DetailedReportProps) => {
  const getPercentageChange = (beforeValue: number, afterValue: number) => {
    const change = ((afterValue - beforeValue) / beforeValue) * 100;
    return change.toFixed(1);
  };

  const getChangeIcon = (beforeValue: number, afterValue: number) => {
    if (!after) return <Minus className="h-4 w-4 text-gray-400" />;
    return afterValue > beforeValue ? 
      <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
      <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4">Rapport détaillé</h4>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Engagement</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{(before.engagement * 100).toFixed(1)}%</p>
              {after && (
                <div className="flex items-center">
                  {getChangeIcon(before.engagement, after.engagement)}
                  <span className="text-sm">
                    {getPercentageChange(before.engagement, after.engagement)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">CPA</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{before.cpa}€</p>
              {after && (
                <div className="flex items-center">
                  {getChangeIcon(before.cpa, after.cpa)}
                  <span className="text-sm">
                    {getPercentageChange(before.cpa, after.cpa)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">ROI</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{(before.roi * 100).toFixed(1)}%</p>
              {after && (
                <div className="flex items-center">
                  {getChangeIcon(before.roi, after.roi)}
                  <span className="text-sm">
                    {getPercentageChange(before.roi, after.roi)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {after && (
          <div className="mt-4">
            <h5 className="text-sm font-medium mb-2">Améliorations apportées</h5>
            <ul className="space-y-2">
              {after.recommendations.map((rec, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};