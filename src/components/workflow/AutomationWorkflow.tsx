import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { SegmentationModule } from './modules/SegmentationModule';
import { CampaignAutomationModule } from './modules/CampaignAutomationModule';
import { PredictiveAnalysisModule } from './modules/PredictiveAnalysisModule';

export const AutomationWorkflow = () => {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState('segmentation');

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6">
      <Tabs value={activeModule} onValueChange={setActiveModule}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="automation">Automatisation</TabsTrigger>
          <TabsTrigger value="analysis">Analyse Prédictive</TabsTrigger>
        </TabsList>

        <TabsContent value="segmentation">
          <SegmentationModule leads={leads || []} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="automation">
          <CampaignAutomationModule />
        </TabsContent>

        <TabsContent value="analysis">
          <PredictiveAnalysisModule leads={leads || []} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};