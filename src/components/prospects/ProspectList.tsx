import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { useAuth } from '@/hooks/useAuth';
import { ProspectCard } from './ProspectCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon } from "lucide-react";

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadProspects();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterProspects();
  }, [searchTerm, prospects]);

  const loadProspects = async () => {
    setIsLoading(true);
    try {
      const data = await ProspectService.getProspects();
      setProspects(data);
      setFilteredProspects(data);
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

  const filterProspects = () => {
    if (!searchTerm) {
      setFilteredProspects(prospects);
      return;
    }

    const filtered = prospects.filter(prospect => 
      prospect.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProspects(filtered);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Liste des Prospects</h2>
        <div className="flex gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProspects.length === 0 ? (
            <p className="text-center text-gray-500">Aucun prospect trouvé</p>
          ) : (
            filteredProspects.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onScheduleMeeting={handleScheduleMeeting}
              />
            ))
          )}
        </div>
      )}
    </Card>
  );
};