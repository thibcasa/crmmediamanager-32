import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TestResults } from "../types/test-results";

interface MetricsVisualizationProps {
  before: TestResults;
  after?: TestResults;
}

export const MetricsVisualization = ({ before, after }: MetricsVisualizationProps) => {
  const data = [
    {
      name: 'Engagement',
      avant: before.engagement * 100,
      après: after ? after.engagement * 100 : undefined
    },
    {
      name: 'Taux de clic',
      avant: before.clickRate * 100,
      après: after ? after.clickRate * 100 : undefined
    },
    {
      name: 'Conversions',
      avant: before.conversionRate * 100,
      après: after ? after.conversionRate * 100 : undefined
    },
    {
      name: 'ROI',
      avant: before.roi * 100,
      après: after ? after.roi * 100 : undefined
    }
  ];

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-4">Comparaison des métriques</h4>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avant" fill="#4f46e5" name="Avant" />
            {after && <Bar dataKey="après" fill="#22c55e" name="Après" />}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};