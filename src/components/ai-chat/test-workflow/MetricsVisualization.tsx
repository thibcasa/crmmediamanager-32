import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TestResults } from "./types/test-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LineChart as LineChartIcon } from "lucide-react";

interface MetricsVisualizationProps {
  before: TestResults;
  after?: TestResults;
}

export const MetricsVisualization = ({ before, after }: MetricsVisualizationProps) => {
  const barData = [
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

  const lineData = before.predictedMetrics ? [
    { semaine: 1, leads: before.predictedMetrics.leadsPerWeek },
    { semaine: 2, leads: before.predictedMetrics.leadsPerWeek * 1.2 },
    { semaine: 3, leads: before.predictedMetrics.leadsPerWeek * 1.5 },
    { semaine: 4, leads: before.predictedMetrics.leadsPerWeek * 1.8 }
  ] : [];

  return (
    <Card className="p-4">
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Projection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avant" fill="#4f46e5" name="Avant" />
                {after && <Bar dataKey="après" fill="#22c55e" name="Après" />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="line">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                  name="Leads projetés"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};