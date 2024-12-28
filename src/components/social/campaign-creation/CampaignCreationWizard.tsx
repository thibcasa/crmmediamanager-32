import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, MessageSquare, Rocket, BarChart2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface CampaignData {
  platform: string;
  targetAudience: string;
  content: string;
  objectives: string[];
}

export const CampaignCreationWizard = () => {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState('targeting');
  const [campaignData, setCampaignData] = useState<CampaignData>({
    platform: 'linkedin',
    targetAudience: '',
    content: '',
    objectives: []
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Création de la campagne
      const { data: campaign, error } = await supabase.from('social_campaigns').insert({
        platform: campaignData.platform,
        name: `Campagne ${new Date().toLocaleDateString()} - ${campaignData.targetAudience}`,
        status: 'draft',
        targeting_criteria: {
          audience: campaignData.targetAudience,
          location: 'Alpes-Maritimes',
          interests: ['Immobilier', 'Investissement'],
          objectives: campaignData.objectives
        },
        message_template: campaignData.content,
        user_id: user.id
      }).select().single();

      if (error) throw error;

      toast({
        title: "Campagne créée avec succès !",
        description: "Votre campagne a été créée et est prête pour les tests."
      });

      // Création du workflow associé
      await supabase.from('workflow_templates').insert({
        name: `Workflow - ${campaign.name}`,
        user_id: user.id,
        triggers: [
          {
            type: 'engagement_threshold',
            config: { threshold: 0.5 }
          }
        ],
        actions: [
          {
            type: 'optimize_content',
            config: { frequency: 'daily' }
          },
          {
            type: 'lead_nurturing',
            config: { delay: '2d' }
          }
        ]
      });

    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="p-6">
      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Ciblage
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Objectifs
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="targeting">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Définissez votre cible</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zone géographique
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Alpes-Maritimes (06)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de propriétaires
                  </label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={campaignData.targetAudience}
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      targetAudience: e.target.value
                    }))}
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="residential">Résidentiel</option>
                    <option value="investment">Investisseur</option>
                    <option value="luxury">Luxe</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Créez votre message</h3>
              <textarea
                className="w-full p-4 border rounded-lg min-h-[200px]"
                placeholder="Écrivez votre message ici..."
                value={campaignData.content}
                onChange={(e) => setCampaignData(prev => ({
                  ...prev,
                  content: e.target.value
                }))}
              />
            </Card>
          </TabsContent>

          <TabsContent value="objectives">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Définissez vos objectifs</h3>
              <div className="space-y-4">
                {[
                  'Obtenir des mandats',
                  'Développer la notoriété',
                  'Générer des estimations',
                  'Créer une communauté'
                ].map((objective) => (
                  <label key={objective} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={campaignData.objectives.includes(objective)}
                      onChange={(e) => {
                        setCampaignData(prev => ({
                          ...prev,
                          objectives: e.target.checked
                            ? [...prev.objectives, objective]
                            : prev.objectives.filter(o => o !== objective)
                        }));
                      }}
                      className="form-checkbox h-5 w-5"
                    />
                    <span>{objective}</span>
                  </label>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Aperçu de votre campagne</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium">Cible</h4>
                  <p className="text-sm text-muted-foreground">
                    Propriétaires {campaignData.targetAudience} - Alpes-Maritimes
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Message</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {campaignData.content}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Objectifs</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {campaignData.objectives.map((obj) => (
                      <li key={obj}>{obj}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={handleCreateCampaign}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? 'Création en cours...' : 'Créer la campagne'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};