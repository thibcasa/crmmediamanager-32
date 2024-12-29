import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PersonaFilterManager } from '@/components/persona/PersonaFilterManager';
import { LocationSelector } from '../targeting/LocationSelector';
import { ContentStrategyForm } from '../content/ContentStrategyForm';
import { MultiChannelSelector } from '../targeting/MultiChannelSelector';
import { supabase } from '@/lib/supabaseClient';
import { SocialPlatform } from '@/types/social';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export const CampaignCreationWizard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState('persona');
  const [campaignName, setCampaignName] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
  const [contentStrategy, setContentStrategy] = useState({
    postTypes: ['image', 'carousel'],
    postingFrequency: 'daily',
    bestTimes: ['09:00', '12:00', '17:00'],
    contentThemes: ['property_showcase']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const generateAIContent = async () => {
    if (!campaignName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de campagne",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('campaign-content-generator', {
        body: {
          campaignName,
          platform: selectedPlatforms[0],
          targetAudience: "Propriétaires immobiliers Alpes-Maritimes"
        }
      });

      if (error) throw error;

      setGeneratedContent(data);
      toast({
        title: "Contenu généré",
        description: "Le contenu de la campagne a été généré avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la génération du contenu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le contenu",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            posting_frequency: contentStrategy.postingFrequency,
            best_times: contentStrategy.bestTimes,
            post_types: contentStrategy.postTypes,
            content_themes: contentStrategy.contentThemes,
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

      <div className="space-y-6 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de la campagne</label>
          <Input
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Ex: Prospection Propriétaires Nice Q2 2024"
          />
        </div>

        <Button
          onClick={generateAIContent}
          disabled={isSubmitting || !campaignName}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer le contenu avec l'IA
            </>
          )}
        </Button>

        {generatedContent && (
          <Card className="p-4 space-y-4 bg-muted">
            <div>
              <h3 className="font-medium">Titre SEO</h3>
              <p>{generatedContent.seoTitle}</p>
            </div>
            <div>
              <h3 className="font-medium">Description SEO</h3>
              <p>{generatedContent.seoDescription}</p>
            </div>
            <div>
              <h3 className="font-medium">Contenu Social</h3>
              <p>{generatedContent.socialContent}</p>
            </div>
            {generatedContent.imageUrl && (
              <div>
                <h3 className="font-medium">Visuel généré</h3>
                <img 
                  src={generatedContent.imageUrl} 
                  alt="Visuel de campagne"
                  className="rounded-lg mt-2 w-full"
                />
              </div>
            )}
          </Card>
        )}
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="persona">Persona</TabsTrigger>
          <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
          <TabsTrigger value="location">Localisation</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="persona">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Création de Persona</h2>
                <p className="text-muted-foreground">
                  Définissez vos personas cibles pour une meilleure segmentation de votre audience
                </p>
              </div>
              <PersonaFilterManager />
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Sélection des Réseaux Sociaux</h2>
                <p className="text-muted-foreground">
                  Choisissez les plateformes pour votre campagne
                </p>
              </div>
              <MultiChannelSelector 
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
              />
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <LocationSelector 
              selectedLocations={selectedLocations}
              onLocationChange={setSelectedLocations}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentStrategyForm 
              initialStrategy={contentStrategy}
              onChange={setContentStrategy}
            />
          </TabsContent>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {activeStep !== 'persona' && (
            <Button
              variant="outline"
              onClick={() => {
                const steps = ['persona', 'social', 'location', 'content'];
                const currentIndex = steps.indexOf(activeStep);
                setActiveStep(steps[currentIndex - 1]);
              }}
            >
              Précédent
            </Button>
          )}
          {activeStep === 'content' ? (
            <Button 
              onClick={handleSaveCampaign}
              disabled={isSubmitting || !generatedContent}
            >
              {isSubmitting ? 'Création...' : 'Créer la campagne'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const steps = ['persona', 'social', 'location', 'content'];
                const currentIndex = steps.indexOf(activeStep);
                setActiveStep(steps[currentIndex + 1]);
              }}
            >
              Suivant
            </Button>
          )}
        </div>
      </Tabs>
    </Card>
  );
};