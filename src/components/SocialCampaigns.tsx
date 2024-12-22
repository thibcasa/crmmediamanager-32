import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService, Platform } from '@/services/SocialCampaignService';
import { Facebook, Instagram, Linkedin, Twitter, MessageCircle, Send } from 'lucide-react';

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Send,
  whatsapp: MessageCircle,
};

export const SocialCampaigns = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [targetingCriteria, setTargetingCriteria] = useState('');

  const { data: campaigns, refetch } = useQuery({
    queryKey: ['social-campaigns'],
    queryFn: SocialCampaignService.getCampaigns,
  });

  const handleCreateCampaign = async () => {
    try {
      await SocialCampaignService.createCampaign({
        name,
        platform,
        message_template: messageTemplate,
        targeting_criteria: JSON.parse(targetingCriteria || '{}'),
        status: 'draft',
        schedule: null,
      });
      
      toast({
        title: "Succès",
        description: "Campagne créée avec succès"
      });
      
      refetch();
      setName('');
      setMessageTemplate('');
      setTargetingCriteria('');
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
      
      <div className="space-y-4">
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
          <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
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
              <SelectItem value="twitter">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </div>
              </SelectItem>
              <SelectItem value="tiktok">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  TikTok
                </div>
              </SelectItem>
              <SelectItem value="whatsapp">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
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
            className="min-h-[100px]"
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

        <Button onClick={handleCreateCampaign} className="w-full">
          Créer la campagne
        </Button>
      </div>

      {campaigns && campaigns.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-4">Campagnes existantes</h3>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(campaign.platform)}
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">Status: {campaign.status}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};