import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Impressions', value: 10000, target: 12000 },
  { name: 'Clics', value: 500, target: 600 },
  { name: 'Leads', value: 50, target: 60 },
  { name: 'Mandats', value: 4, target: 4 },
];

export const MetricsPreview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((metric) => (
          <Card key={metric.name} className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric.name}
            </h3>
            <p className="text-2xl font-bold mt-2">
              {metric.value.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Objectif: {metric.target.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Progression vers les objectifs</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
              <Bar dataKey="target" fill="#e5e7eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};