import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";
import { Bot } from 'lucide-react';

interface ContactDistributionProps {
  data: Array<{
    name: string;
    value: number;
    aiScore: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const ContactDistribution = ({ data }: ContactDistributionProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Distribution des Contacts</h3>
        <Bot className="w-5 h-5 text-blue-500" />
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, aiScore }) => 
                `${name} (${value}) - Score IA: ${aiScore}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};