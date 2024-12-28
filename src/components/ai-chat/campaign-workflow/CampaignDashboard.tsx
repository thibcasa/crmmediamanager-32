import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, LineChart, Target, Settings, History } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { CampaignMetrics } from './dashboard/CampaignMetrics';
import { CampaignHistory } from './dashboard/CampaignHistory';
import { CampaignSettings } from './dashboard/CampaignSettings';

interface Campaign {
  id: string;
  name: string;
  status: string;
  created_at: string;
  metrics: any;
}

export const CampaignDashboard = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les campagnes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Tableau de Bord des Campagnes</h2>
        <p className="text-muted-foreground">
          Gérez et suivez vos campagnes marketing
        </p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Métriques
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <CampaignMetrics campaigns={campaigns} />
        </TabsContent>

        <TabsContent value="history">
          <CampaignHistory campaigns={campaigns} />
        </TabsContent>

        <TabsContent value="settings">
          <CampaignSettings onUpdate={fetchCampaigns} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};