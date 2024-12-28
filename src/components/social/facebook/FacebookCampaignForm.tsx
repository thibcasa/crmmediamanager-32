import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectivesSection } from './sections/ObjectivesSection';
import { AudienceSection } from './sections/AudienceSection';
import { ContentSection } from './sections/ContentSection';
import { BudgetSection } from './sections/BudgetSection';
import { KPIsSection } from './sections/KPIsSection';
import { Button } from "@/components/ui/button";
import { SocialCampaignService } from '@/services/SocialCampaignService';

export const FacebookCampaignForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    objectives: {
      leadGeneration: true,
      brandAwareness: false,
      expertise: false
    },
    audience: {
      location: "Nice, Alpes-Maritimes",
      ageRange: "35-65",
      interests: ["Immobilier", "Investissement"]
    },
    content: {
      format: "image",
      cta: "En savoir plus",
      landingPage: "form"
    },
    budget: {
      daily: 50,
      duration: 30,
      distribution: "automatic"
    },
    kpis: {
      targetCTR: 2.5,
      targetCPL: 15,
      targetConversionRate: 10
    }
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const formattedCampaign = {
        name: `Campagne Facebook - ${campaignData.name}`,
        platform: 'facebook' as const,
        status: 'draft',
        message_template: '',
        targeting_criteria: {
          location: campaignData.audience.location,
          age_range: campaignData.audience.ageRange,
          interests: campaignData.audience.interests
        },
        schedule: {
          budget: campaignData.budget,
          duration: campaignData.budget.duration,
          distribution: campaignData.budget.distribution
        },
        ai_feedback: null,
        posts: [],
        post_triggers: [],
        target_metrics: {
          ctr: campaignData.kpis.targetCTR,
          cpl: campaignData.kpis.targetCPL,
          conversion_rate: campaignData.kpis.targetConversionRate
        }
      };

      await SocialCampaignService.createCampaign(formattedCampaign);

      toast({
        title: "Campagne créée",
        description: "La campagne Facebook a été créée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Nouvelle Campagne Facebook</h2>
      
      <Tabs defaultValue="objectives" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="objectives">Objectifs</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <ObjectivesSection 
            data={campaignData.objectives}
            onChange={(objectives) => setCampaignData({...campaignData, objectives})}
          />
        </TabsContent>

        <TabsContent value="audience">
          <AudienceSection 
            data={campaignData.audience}
            onChange={(audience) => setCampaignData({...campaignData, audience})}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentSection 
            data={campaignData.content}
            onChange={(content) => setCampaignData({...campaignData, content})}
          />
        </TabsContent>

        <TabsContent value="budget">
          <BudgetSection 
            data={campaignData.budget}
            onChange={(budget) => setCampaignData({...campaignData, budget})}
          />
        </TabsContent>

        <TabsContent value="kpis">
          <KPIsSection 
            data={campaignData.kpis}
            onChange={(kpis) => setCampaignData({...campaignData, kpis})}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création...' : 'Créer la campagne'}
        </Button>
      </div>
    </Card>
  );
};