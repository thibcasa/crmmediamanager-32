import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PersonaFilterManager } from '@/components/persona/PersonaFilterManager';
import { LocationSelector } from '../targeting/LocationSelector';
import { ContentStrategyForm } from '../content/ContentStrategyForm';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export const CampaignCreationWizard = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState('persona');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [contentStrategy, setContentStrategy] = useState({
    postTypes: ['image', 'carousel'],
    postingFrequency: 'daily',
    bestTimes: ['09:00', '12:00', '17:00'],
    contentThemes: ['property_showcase']
  });

  const handleSaveCampaign = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .insert({
          user_id: user.id,
          name: 'Nouvelle Campagne',
          platform: 'linkedin',
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
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Création de Campagne</h2>
        <p className="text-muted-foreground">
          Configurez votre campagne de prospection immobilière
        </p>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="persona">Persona</TabsTrigger>
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
                const steps = ['persona', 'location', 'content'];
                const currentIndex = steps.indexOf(activeStep);
                setActiveStep(steps[currentIndex - 1]);
              }}
            >
              Précédent
            </Button>
          )}
          {activeStep === 'content' ? (
            <Button onClick={handleSaveCampaign}>
              Créer la campagne
            </Button>
          ) : (
            <Button
              onClick={() => {
                const steps = ['persona', 'location', 'content'];
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