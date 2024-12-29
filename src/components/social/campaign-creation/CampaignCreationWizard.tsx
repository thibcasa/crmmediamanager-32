import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PersonaFilterManager } from '@/components/persona/PersonaFilterManager';
import { LocationSelector } from '../targeting/LocationSelector';
import { MultiChannelSelector } from '../targeting/MultiChannelSelector';
import { supabase } from '@/lib/supabaseClient';
import { SocialPlatform } from '@/types/social';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from "lucide-react";
import { CampaignBasicInfo } from './steps/CampaignBasicInfo';
import { ContentGenerationStep } from './steps/ContentGenerationStep';
import { GeneratedContentDisplay } from './steps/GeneratedContentDisplay';

export const CampaignCreationWizard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState('persona');
  const [campaignName, setCampaignName] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveCampaign = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur d'authentification",
        description: "Vous devez être connecté pour créer une campagne",
        variant: "destructive",
      });
      return;
    }

    if (!generatedContent) {
      toast({
        title: "Contenu manquant",
        description: "Veuillez d'abord générer le contenu avec l'IA",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .insert({
          user_id: user.id,
          name: campaignName,
          platform: selectedPlatforms[0],
          status: 'draft',
          targeting_criteria: {
            keywords: generatedContent.keywords,
            hashtags: generatedContent.hashtags
          },
          content_strategy: {
            seo_title: generatedContent.seoTitle,
            seo_description: generatedContent.seoDescription,
            social_content: generatedContent.socialContent,
            image_url: generatedContent.imageUrl
          },
          target_locations: selectedLocations
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: "La campagne a été créée avec succès avec le contenu optimisé",
      });

    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Connexion requise</h2>
          <p className="text-muted-foreground">
            Veuillez vous connecter pour créer une campagne
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Création de Campagne</h2>
        <p className="text-muted-foreground">
          Configurez votre campagne de prospection immobilière
        </p>
      </div>

      <CampaignBasicInfo 
        campaignName={campaignName}
        onCampaignNameChange={setCampaignName}
      />

      <div className="mt-6">
        <Tabs value={activeStep} onValueChange={setActiveStep}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="persona">Persona</TabsTrigger>
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="persona">
              <PersonaFilterManager />
            </TabsContent>

            <TabsContent value="social">
              <MultiChannelSelector 
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
              />
            </TabsContent>

            <TabsContent value="location">
              <LocationSelector 
                selectedLocations={selectedLocations}
                onLocationChange={setSelectedLocations}
              />
            </TabsContent>

            <TabsContent value="content">
              <div className="space-y-6">
                <ContentGenerationStep
                  campaignName={campaignName}
                  selectedPlatforms={selectedPlatforms}
                  onContentGenerated={setGeneratedContent}
                />
                
                {generatedContent && (
                  <GeneratedContentDisplay content={generatedContent} />
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};