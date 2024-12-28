import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictiveAnalysis } from '@/components/analytics/PredictiveAnalysis';
import { ContactImport } from '@/components/contacts/ContactImport';
import { ContactSegmentation } from '@/components/contacts/ContactSegmentation';
import { TestWorkflow } from '@/components/ai-chat/TestWorkflow';
import { Brain, Users, TrendingUp, TestTube2 } from 'lucide-react';

const AiChat = () => {
  const [activeTab, setActiveTab] = useState('test');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Assistant IA</h1>
        <p className="text-muted-foreground mt-2">
          Analysez, testez et optimisez vos campagnes marketing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube2 className="w-4 h-4" />
            Test & Validation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Analyse Prédictive
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Gestion des Contacts
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <TestWorkflow />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PredictiveAnalysis campaignId="default" />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <ContactImport />
          <ContactSegmentation />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium">Analyse des Performances</h3>
            <p className="text-muted-foreground">
              Module en cours de développement
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiChat;