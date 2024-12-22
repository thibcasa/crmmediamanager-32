import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { useAuth } from '@/hooks/useAuth';
import { ProspectStats } from './ProspectStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  MailIcon, 
  PhoneIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon
} from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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

  const handleDeleteProspect = async (prospectId: string) => {
    try {
      await ProspectService.deleteProspect(prospectId);
      toast({
        title: "Succès",
        description: "Prospect supprimé",
      });
      loadProspects();
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prospect",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <p className="text-center">Veuillez vous connecter pour voir vos prospects</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProspectStats prospects={prospects} />
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Liste des Prospects</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <MailIcon className="h-4 w-4 mr-2" />
              Campagne Email
            </Button>
            <Button>
              <UserIcon className="h-4 w-4 mr-2" />
              Nouveau Prospect
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernier contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prospects.map((prospect) => (
                  <TableRow key={prospect.id}>
                    <TableCell className="font-medium">
                      {prospect.first_name} {prospect.last_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center text-sm">
                          <MailIcon className="h-3 w-3 mr-1" />
                          {prospect.email}
                        </span>
                        {prospect.phone && (
                          <span className="flex items-center text-sm">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            {prospect.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{prospect.source}</TableCell>
                    <TableCell>
                      <span className={getScoreColor(prospect.score)}>
                        {prospect.score}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                        {prospect.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(prospect.last_contact_date), 'dd MMM yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleScheduleMeeting(prospect.id)}
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProspect(prospect.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};