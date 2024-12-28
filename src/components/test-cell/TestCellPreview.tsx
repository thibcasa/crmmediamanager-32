import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import { Wand2, Play, BarChart2, Target, TestTube2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CreativesPreview } from './CreativesPreview';
import { WorkflowPreview } from './WorkflowPreview';
import { MetricsPreview } from './MetricsPreview';

export const TestCellPreview = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('test');
  const [testStatus, setTestStatus] = useState<'pending' | 'success' | 'warning' | 'error'>('pending');
  const [testResults, setTestResults] = useState<any>(null);

  const handleTest = async () => {
    setIsGenerating(true);
    try {
      // Simulation du test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults({
        engagement: 0.15,
        clickRate: 0.08,
        conversionRate: 0.03,
        recommendations: [
          "Ajuster le ton pour le marché premium",
          "Ajouter plus de visuels de qualité",
          "Renforcer l'appel à l'action"
        ]
      });
      setTestStatus('warning');
      toast({
        title: "Test terminé",
        description: "Des ajustements sont recommandés avant la mise en production",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de compléter le test",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
            Testez et validez votre campagne avant son lancement
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
            disabled={testStatus !== 'success'}
          >
            <Play className="h-4 w-4" />
            Déployer
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <TestTube2 className="h-4 w-4" />
            Test
          </TabsTrigger>
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

        <TabsContent value="test" className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">État des Tests</h3>
                <div className="flex items-center gap-2 mt-2">
                  {testStatus === 'pending' && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {testStatus === 'warning' && (
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  )}
                  {testStatus === 'success' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-sm">
                    {testStatus === 'pending' && "En attente de test"}
                    {testStatus === 'warning' && "Ajustements recommandés"}
                    {testStatus === 'success' && "Tests validés"}
                  </span>
                </div>
              </div>
              <Button 
                onClick={handleTest}
                disabled={isGenerating}
                variant="outline"
              >
                Lancer les tests
              </Button>
            </div>

            {testResults && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm font-medium">Engagement estimé</p>
                    <p className="text-2xl font-bold">{(testResults.engagement * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm font-medium">Taux de clic</p>
                    <p className="text-2xl font-bold">{(testResults.clickRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <p className="text-sm font-medium">Taux de conversion</p>
                    <p className="text-2xl font-bold">{(testResults.conversionRate * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recommandations</h4>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

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