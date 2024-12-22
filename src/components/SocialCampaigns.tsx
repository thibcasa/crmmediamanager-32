import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService, Platform } from '@/services/SocialCampaignService';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MessageCircle, 
  Send,
  Users,
  Target,
  Calendar 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Send,
  whatsapp: MessageCircle,
};

const platformTemplates = {
  linkedin: `Bonjour {first_name},

Je suis agent immobilier dans les Alpes-Maritimes et je remarque que vous êtes propriétaire dans la région.

Seriez-vous intéressé(e) par une estimation gratuite de votre bien ? Je peux vous fournir une analyse détaillée du marché local.

Bien cordialement`,
  whatsapp: `Bonjour {first_name},

Je suis {agent_name}, agent immobilier spécialisé dans les Alpes-Maritimes.

Je recherche activement des biens pour mes clients et je me demandais si vous seriez intéressé(e) par une estimation gratuite de votre propriété ?

Bien cordialement`,
  facebook: `🏠 Propriétaire dans les Alpes-Maritimes ?

Découvrez la valeur de votre bien avec notre estimation gratuite et personnalisée !

✨ Expertise locale
📊 Analyse de marché détaillée
💯 Sans engagement

Contactez-nous pour en savoir plus !`,
};

export const SocialCampaigns = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [targetingCriteria, setTargetingCriteria] = useState('');
  const [schedule, setSchedule] = useState('');

  const { data: campaigns, refetch } = useQuery({
    queryKey: ['social-campaigns'],
    queryFn: SocialCampaignService.getCampaigns,
  });

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setMessageTemplate(platformTemplates[value] || '');
  };

  const handleCreateCampaign = async () => {
    try {
      await SocialCampaignService.createCampaign({
        name,
        platform,
        message_template: messageTemplate,
        targeting_criteria: JSON.parse(targetingCriteria || '{}'),
        status: 'draft',
        schedule: schedule ? JSON.parse(schedule) : null,
      });
      
      toast({
        title: "Succès",
        description: "Campagne créée avec succès"
      });
      
      refetch();
      setName('');
      setMessageTemplate('');
      setTargetingCriteria('');
      setSchedule('');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platformName: Platform) => {
    const Icon = platformIcons[platformName] || Send;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Campagnes Social Media</h2>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Nouvelle Campagne</TabsTrigger>
          <TabsTrigger value="list">Campagnes Existantes</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de la campagne</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Prospection LinkedIn Q2 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Plateforme</label>
            <Select value={platform} onValueChange={handlePlatformChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une plateforme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="facebook">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </div>
                </SelectItem>
                <SelectItem value="instagram">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Template de message</label>
            <Textarea
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              placeholder="Bonjour {first_name}, je vois que vous êtes propriétaire..."
              className="min-h-[200px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Critères de ciblage (JSON)</label>
            <Textarea
              value={targetingCriteria}
              onChange={(e) => setTargetingCriteria(e.target.value)}
              placeholder='{"location": "Alpes-Maritimes", "interests": ["immobilier", "investissement"]}'
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Planning de publication (JSON)</label>
            <Textarea
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder='{"frequency": "daily", "time": "09:00", "days": ["monday", "wednesday", "friday"]}'
              className="font-mono text-sm"
            />
          </div>

          <Button onClick={handleCreateCampaign} className="w-full">
            Créer la campagne
          </Button>
        </TabsContent>

        <TabsContent value="list">
          {campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(campaign.platform)}
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {campaign.targeting_criteria ? Object.keys(campaign.targeting_criteria).length : 0} critères
                          </span>
                          {campaign.schedule && (
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Planifié
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' : 
                      campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune campagne créée pour le moment</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};