import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { ProspectCard } from './ProspectCard';

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    if (isAuthenticated) {
      loadProspects();
    }
  }, [isAuthenticated]);

  const loadProspects = async () => {
    setIsLoading(true);
    try {
      const data = await ProspectService.getProspects();
      setProspects(data);
    } catch (error) {
      console.error('Error loading prospects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les prospects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleMeeting = async (prospectId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour programmer un rendez-vous",
        variant: "destructive",
      });
      return;
    }

    try {
      await CalendarService.createMeeting({
        prospectId,
        date: new Date(),
        duration: 60,
        type: 'discovery',
        status: 'scheduled'
      });
      toast({
        title: "Succès",
        description: "Rendez-vous programmé",
      });
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de programmer le rendez-vous",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <p className="text-center">Veuillez vous connecter pour voir vos prospects</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Liste des Prospects</h2>
      {isLoading ? (
        <div>Chargement...</div>
      ) : (
        <div className="space-y-4">
          {prospects.map((prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onScheduleMeeting={handleScheduleMeeting}
            />
          ))}
        </div>
      )}
    </Card>
  );
};