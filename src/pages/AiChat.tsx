import { ContentGenerator } from "@/components/content/ContentGenerator";
import { TrendAnalyzer } from "@/components/analytics/TrendAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, TrendingUp } from 'lucide-react';

const AiChat = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Assistant IA Marketing</h1>
      
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Générateur
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <ContentGenerator />
        </TabsContent>

        <TabsContent value="trends">
          <TrendAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;