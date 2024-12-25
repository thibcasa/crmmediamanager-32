import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Send } from 'lucide-react';

export const CampaignAutomationModule = () => {
  const { toast } = useToast();
  const [isScheduling, setIsScheduling] = useState(false);

  const scheduleCampaign = async () => {
    setIsScheduling(true);
    try {
      // Logique d'automatisation à implémenter
      toast({
        title: "Campagne programmée",
        description: "La campagne a été planifiée avec succès",
      });
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer la campagne",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Automatisation des Campagnes</h3>
          <p className="text-sm text-muted-foreground">
            Planifiez et automatisez vos campagnes marketing
          </p>
        </div>
        <Button 
          onClick={scheduleCampaign}
          disabled={isScheduling}
          className="flex items-center gap-2"
        >
          {isScheduling ? (
            <>
              <Calendar className="w-4 h-4 animate-pulse" />
              Planification...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Programmer
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Campagnes actives</h4>
          <div className="text-sm text-muted-foreground">
            Aucune campagne active
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Campagnes planifiées</h4>
          <div className="text-sm text-muted-foreground">
            Aucune campagne planifiée
          </div>
        </Card>
      </div>
    </div>
  );
};