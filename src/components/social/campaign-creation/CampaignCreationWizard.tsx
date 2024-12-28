import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PersonaFilterManager } from '../../persona/PersonaFilterManager';
import { LocationSelector } from '../targeting/LocationSelector';
import { ContentStrategyForm } from '../content/ContentStrategyForm';
import { supabase } from '@/lib/supabaseClient';
import { Target, MapPin, Users, MessageSquare } from 'lucide-react';

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

  const handleCreateCampaign = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('social_campaigns')
        .insert({
          name: `Campagne Immobilière ${new Date().toLocaleDateString()}`,
          platform: 'linkedin',
          status: 'draft',
          target_locations: selectedLocations,
          content_strategy: contentStrategy,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: "La campagne a été créée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="persona" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Persona
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Zones
          </TabsTrigger>
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ciblage
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contenu
          </TabsTrigger>
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

          <TabsContent value="targeting">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Critères de ciblage</h3>
              {/* Critères de ciblage spécifiques */}
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <ContentStrategyForm
              initialStrategy={contentStrategy}
              onChange={setContentStrategy}
            />
            <div className="mt-6">
              <Button onClick={handleCreateCampaign} className="w-full">
                Créer la campagne
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};