import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { SocialCampaign } from "@/types/social";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";

interface CampaignAnalyticsProps {
  campaign: SocialCampaign;
}

export const CampaignAnalytics = ({ campaign }: CampaignAnalyticsProps) => {
  const { data: analytics } = useQuery({
    queryKey: ['campaign-analytics', campaign.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_analytics')
        .select('*')
        .eq('source_campaign', campaign.id);
      
      if (error) throw error;
      return data;
    }
  });

  const engagementData = analytics?.map(item => ({
    date: new Date(item.analyzed_at).toLocaleDateString(),
    engagement: item.engagement_score * 100,
    sentiment: item.sentiment_score * 100
  })) || [];

  return (
    <Card className="p-6">
      <Tabs defaultValue="engagement">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations IA</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="engagement" fill="#4F46E5" name="Engagement %" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="sentiment" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sentiment" fill="#10B981" name="Sentiment %" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Recommandations de l'IA</h3>
            <ul className="list-disc pl-5 space-y-2">
              {analytics?.map((item, index) => (
                item.next_actions && (
                  <li key={index} className="text-sm text-gray-700">
                    {JSON.stringify(item.next_actions.suggestions)}
                  </li>
                )
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};