import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        loadProspects();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
    if (user) {
      loadProspects();
    }
  };

  const loadProspects = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await ProspectService.getProspects();
      setProspects(data);
    } catch (error) {
      console.error('Error loading prospects:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    if (activeTab === 'all') return true;
    return prospect.qualification === activeTab;
  });

  const getQualificationColor = (qualification: string) => {
    switch (qualification) {
      case 'lead':
        return 'bg-blue-100 text-blue-800';
      case 'prospect':
        return 'bg-yellow-100 text-yellow-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleMeeting = async (leadId: string) => {
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
        title: "Rendez-vous découverte",
        description: "Premier contact avec le prospect",
        date: new Date(),
        duration: 60,
        type: 'discovery',
        status: 'scheduled',
        lead_id: leadId
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
        <p className="text-center">Veuillez vous connecter pour voir vos contacts</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Liste des Contacts</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Tous ({prospects.length})
          </TabsTrigger>
          <TabsTrigger value="lead">
            Leads ({prospects.filter(p => p.qualification === 'lead').length})
          </TabsTrigger>
          <TabsTrigger value="prospect">
            Prospects ({prospects.filter(p => p.qualification === 'prospect').length})
          </TabsTrigger>
          <TabsTrigger value="client">
            Clients ({prospects.filter(p => p.qualification === 'client').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div>Chargement...</div>
          ) : (
            <div className="space-y-4">
              {filteredProspects.map((prospect) => (
                <Card key={prospect.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{prospect.first_name} {prospect.last_name}</p>
                        <Badge className={getQualificationColor(prospect.qualification)}>
                          {prospect.qualification?.charAt(0).toUpperCase() + prospect.qualification?.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{prospect.email}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          Score: {prospect.score}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          Status: {prospect.status}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleScheduleMeeting(prospect.id)}
                      variant="outline"
                      size="sm"
                    >
                      Programmer RDV
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};