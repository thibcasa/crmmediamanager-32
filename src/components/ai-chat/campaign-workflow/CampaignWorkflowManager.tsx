import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CreativeGenerator } from './CreativeGenerator';
import { ContentGenerator } from './ContentGenerator';
import { CampaignPreview } from './CampaignPreview';
import { TestingDashboard } from './TestingDashboard';
import { ProductionDashboard } from './ProductionDashboard';
import { Brain, Image, MessageSquare, TestTube, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export interface CampaignData {
  objective: string;
  creatives: Array<{
    type: 'image' | 'video';
    url: string;
    format: string;
  }>;
  content: Array<{
    type: 'post' | 'story' | 'reel' | 'article';
    text: string;
  }>;
  predictions: {
    engagement: number;
    costPerLead: number;
    roi: number;
    estimatedLeads: number;
  };
  workflow: {
    steps: Array<{
      name: string;
      status: 'pending' | 'completed' | 'in_progress';
    }>;
  };
}

export const CampaignWorkflowManager = () => {
  const { toast } = useToast();
  const [activePhase, setActivePhase] = useState<string>('creatives');
  const [campaignData, setCampaignData] = useState<CampaignData>({
    objective: '',
    creatives: [],
    content: [],
    predictions: {
      engagement: 0,
      costPerLead: 0,
      roi: 0,
      estimatedLeads: 0
    },
    workflow: {
      steps: []
    }
  });

  const handleCreativesGenerated = async (creatives: CampaignData['creatives']) => {
    setCampaignData(prev => ({ ...prev, creatives }));
    toast({
      title: "Créatives générées",
      description: `${creatives.length} créatives ont été générées avec succès.`
    });
  };

  const handleContentGenerated = async (content: CampaignData['content']) => {
    setCampaignData(prev => ({ ...prev, content }));
    toast({
      title: "Contenu généré",
      description: "Le contenu textuel a été généré avec succès."
    });
  };

  const handleTestComplete = async (predictions: CampaignData['predictions']) => {
    setCampaignData(prev => ({ ...prev, predictions }));
    
    if (predictions.roi >= 3 && predictions.engagement >= 0.3) {
      toast({
        title: "Test réussi !",
        description: "La campagne est prête pour la production."
      });
      setActivePhase('production');
    } else {
      toast({
        title: "Optimisations nécessaires",
        description: "Des ajustements sont recommandés avant la mise en production."
      });
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="creatives" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Créatives
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Production
          </TabsTrigger>
        </TabsList>

        <TabsContent value="creatives">
          <CreativeGenerator 
            onCreativesGenerated={handleCreativesGenerated}
            existingCreatives={campaignData.creatives}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentGenerator
            onContentGenerated={handleContentGenerated}
            existingContent={campaignData.content}
          />
        </TabsContent>

        <TabsContent value="preview">
          <CampaignPreview
            campaignData={campaignData}
            onUpdate={(updates) => setCampaignData(prev => ({ ...prev, ...updates }))}
          />
        </TabsContent>

        <TabsContent value="testing">
          <TestingDashboard
            campaignData={campaignData}
            onTestComplete={handleTestComplete}
          />
        </TabsContent>

        <TabsContent value="production">
          <ProductionDashboard
            campaignData={campaignData}
            onLaunch={async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Non authentifié');

                const { error } = await supabase.from('social_campaigns').insert({
                  user_id: user.id,
                  name: 'Campagne Webinaire Immobilier',
                  platform: 'linkedin',
                  status: 'active',
                  targeting_criteria: {
                    location: "Alpes-Maritimes",
                    interests: ["Immobilier", "Investissement"],
                    age_range: "35-65"
                  },
                  message_template: campaignData.content[0]?.text || '',
                  schedule: {
                    frequency: "daily",
                    times: ["09:00", "14:00", "17:00"]
                  }
                });

                if (error) throw error;

                toast({
                  title: "Campagne lancée",
                  description: "Votre campagne a été mise en production avec succès."
                });
              } catch (error) {
                console.error('Error launching campaign:', error);
                toast({
                  title: "Erreur",
                  description: "Impossible de lancer la campagne.",
                  variant: "destructive"
                });
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};