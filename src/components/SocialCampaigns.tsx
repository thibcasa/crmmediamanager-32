import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService, Platform } from '@/services/SocialCampaignService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from './social/CampaignList';
import { CampaignAnalytics } from './social/CampaignAnalytics';
import { CreateCampaignForm } from './social/CreateCampaignForm';
import { SocialApiSettings } from './settings/SocialApiSettings';
import { supabase } from '@/lib/supabaseClient';

export const SocialCampaigns = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const { data: campaigns, refetch } = useQuery({
    queryKey: ['social-campaigns'],
    queryFn: SocialCampaignService.getCampaigns,
  });

  const handleCreateSuccess = () => {
    toast({
      title: "Succès",
      description: "Campagne créée avec succès"
    });
    refetch();
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Campagnes Social Media</h2>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Nouvelle Campagne</TabsTrigger>
          <TabsTrigger value="list">Campagnes Existantes</TabsTrigger>
          <TabsTrigger value="analytics">Analyse</TabsTrigger>
          <TabsTrigger value="settings">Configuration API</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreateCampaignForm onSuccess={handleCreateSuccess} />
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

        <TabsContent value="settings">
          <SocialApiSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
};