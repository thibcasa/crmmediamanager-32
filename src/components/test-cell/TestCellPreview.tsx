import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import { Wand2, Play, BarChart2, Target } from 'lucide-react';
import { CreativesPreview } from './CreativesPreview';
import { WorkflowPreview } from './WorkflowPreview';
import { MetricsPreview } from './MetricsPreview';

export const TestCellPreview = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('creatives');

  const handleDeploy = () => {
    toast({
      title: "Campagne déployée",
      description: "Votre campagne a été lancée avec succès"
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold">Cellule de Test</h2>
          <p className="text-muted-foreground mt-1">
            Prévisualisez et ajustez votre campagne avant son lancement
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsGenerating(true)}
            disabled={isGenerating}
          >
            <Wand2 className="h-4 w-4" />
            {isGenerating ? 'Génération...' : 'Générer'}
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={handleDeploy}
          >
            <Play className="h-4 w-4" />
            Déployer
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creatives" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Créatifs
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Workflow
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            KPIs Estimés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creatives">
          <CreativesPreview />
        </TabsContent>

        <TabsContent value="workflow">
          <WorkflowPreview />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsPreview />
        </TabsContent>
      </Tabs>
    </Card>
  );
};