import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Hash } from 'lucide-react';

const mockTrendData = [
  { date: '2024-01', engagement: 65 },
  { date: '2024-02', engagement: 75 },
  { date: '2024-03', engagement: 85 },
  { date: '2024-04', engagement: 90 },
];

const mockHashtags = [
  { tag: '#ImmobilierNice', score: 95 },
  { tag: '#InvestissementCotedAzur', score: 88 },
  { tag: '#BienImmobilier', score: 82 },
  { tag: '#AlpesMaritimes', score: 78 },
];

const mockTimes = [
  { time: '9h-11h', score: 90 },
  { time: '12h-14h', score: 85 },
  { time: '17h-19h', score: 95 },
  { time: '20h-22h', score: 80 },
];

export const TrendAnalyzer = () => {
  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Analyse des Tendances</h2>

        <Tabs defaultValue="engagement">
          <TabsList className="mb-4">
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="hashtags">
            <div className="space-y-4">
              {mockHashtags.map((hashtag) => (
                <div key={hashtag.tag} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{hashtag.tag}</span>
                  <Badge variant="secondary">Score: {hashtag.score}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timing">
            <div className="space-y-4">
              {mockTimes.map((timeSlot) => (
                <div key={timeSlot.time} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">{timeSlot.time}</span>
                  <Badge variant="secondary">Score: {timeSlot.score}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};