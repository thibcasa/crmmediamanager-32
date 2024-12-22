import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService, Platform } from '@/services/SocialCampaignService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from './social/CampaignList';
import { CampaignAnalytics } from './social/CampaignAnalytics';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

const platformTemplates = {
  linkedin: `Bonjour {first_name},\n\nJe suis agent immobilier dans les Alpes-Maritimes...`,
  whatsapp: `Bonjour {first_name},\n\nJe suis {agent_name}, agent immobilier...`,
  facebook: `🏠 Propriétaire dans les Alpes-Maritimes ?\n\nDécouvrez la valeur...`,
};

export const SocialCampaigns = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [targetingCriteria, setTargetingCriteria] = useState('');
  const [schedule, setSchedule] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

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

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Campagnes Social Media</h2>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Nouvelle Campagne</TabsTrigger>
          <TabsTrigger value="list">Campagnes Existantes</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
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
          <CampaignList 
            campaigns={campaigns || []} 
            onSelectCampaign={setSelectedCampaign}
          />
        </TabsContent>

        <TabsContent value="analytics">
          {selectedCampaign ? (
            <CampaignAnalytics campaign={selectedCampaign} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Sélectionnez une campagne pour voir son analyse</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};