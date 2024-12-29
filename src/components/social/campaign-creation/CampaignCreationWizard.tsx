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
import { Loader2 } from "lucide-react";

export const CampaignCreationWizard = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeStep, setActiveStep] = useState('persona');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
  const [contentStrategy, setContentStrategy] = useState({
    postTypes: ['image', 'carousel'],
    postingFrequency: 'daily',
    bestTimes: ['09:00', '12:00', '17:00'],
    contentThemes: ['property_showcase']
  });
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

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .insert({
          user_id: user.id,
          name: 'Nouvelle Campagne',
          platform: selectedPlatforms[0],
          status: 'draft',
          targeting_criteria: {},
          content_strategy: {
            posting_frequency: contentStrategy.postingFrequency,
            best_times: contentStrategy.bestTimes,
            post_types: contentStrategy.postTypes,
            content_themes: contentStrategy.contentThemes
          },
          target_locations: selectedLocations
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: "La campagne a été créée avec succès",
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
              disabled={isSubmitting}
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