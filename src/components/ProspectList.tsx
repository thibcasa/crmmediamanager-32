import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { AIService } from '@/services/AIService';

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);

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

  const generateStrategy = async (prospect: Prospect) => {
    setIsGeneratingStrategy(true);
    try {
      const prompt = `Analyser ce contact immobilier et suggérer une stratégie:
      Type: ${prospect.qualification}
      Nom: ${prospect.first_name} ${prospect.last_name}
      Email: ${prospect.email}
      Téléphone: ${prospect.phone || 'Non fourni'}
      Source: ${prospect.source}
      Score: ${prospect.score}
      Notes: ${prospect.notes || 'Aucune note'}

      Objectif: Générer une stratégie personnalisée pour ce contact en tenant compte de sa qualification (${prospect.qualification}) 
      et de son historique d'interactions.`;

      const strategy = await AIService.generateContent('description', prompt);
      
      // Sauvegarder la stratégie dans la base de données
      await supabase.from('lead_interactions').insert({
        lead_id: prospect.id,
        type: 'ai_strategy',
        content: strategy,
        channel: 'ai',
        status: 'generated',
        metadata: {
          qualification: prospect.qualification,
          score: prospect.score,
          source: prospect.source
        }
      });

      toast({
        title: "Stratégie générée",
        description: "Une nouvelle stratégie a été créée pour ce contact",
      });

    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la stratégie",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

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

  const filteredProspects = prospects.filter(prospect => {
    if (activeTab === 'all') return true;
    return prospect.qualification === activeTab;
  });

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
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-lg">
                            {prospect.first_name} {prospect.last_name}
                          </p>
                          <Badge className={getQualificationColor(prospect.qualification)}>
                            {prospect.qualification?.charAt(0).toUpperCase() + prospect.qualification?.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{prospect.email}</span>
                          </div>
                          {prospect.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{prospect.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            Score: {prospect.score}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            Source: {prospect.source}
                          </span>
                          {prospect.notes && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              <MessageSquare className="w-3 h-3 inline mr-1" />
                              Notes disponibles
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => generateStrategy(prospect)}
                          variant="outline"
                          size="sm"
                          disabled={isGeneratingStrategy}
                        >
                          Générer Stratégie
                        </Button>
                        <Button 
                          onClick={() => handleScheduleMeeting(prospect.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          RDV
                        </Button>
                      </div>
                    </div>

                    {prospect.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                        <p className="font-medium mb-1">Notes:</p>
                        <p className="text-gray-600">{prospect.notes}</p>
                      </div>
                    )}
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