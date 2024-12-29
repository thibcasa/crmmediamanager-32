import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const ActiveCampaigns = () => {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["active-campaigns"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("social_campaigns")
        .select("*")
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleUpdateCampaign = async (campaignId, updates) => {
    try {
      const { error } = await supabase
        .from('social_campaigns')
        .update(updates)
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Campagne mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la campagne.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Chargement des campagnes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Campagnes en cours</h2>
      
      <div className="grid gap-4">
        {campaigns?.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{campaign.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Plateforme: {campaign.platform}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modifier la campagne</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom de la campagne</label>
                      <Input 
                        defaultValue={selectedCampaign?.name}
                        onChange={(e) => {
                          setSelectedCampaign({
                            ...selectedCampaign,
                            name: e.target.value
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea 
                        defaultValue={selectedCampaign?.message_template}
                        onChange={(e) => {
                          setSelectedCampaign({
                            ...selectedCampaign,
                            message_template: e.target.value
                          });
                        }}
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleUpdateCampaign(selectedCampaign.id, {
                        name: selectedCampaign.name,
                        message_template: selectedCampaign.message_template
                      })}
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}

        {campaigns?.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">
            Aucune campagne active en cours
          </Card>
        )}
      </div>
    </div>
  );
};