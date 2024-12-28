import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProspectService, Prospect } from '@/services/ProspectService';
import { CalendarService } from '@/services/CalendarService';
import { supabase } from '@/lib/supabaseClient';
import { AIService } from '@/services/AIService';
import { ProspectTabs } from './prospects/ProspectTabs';
import { ProspectHeader } from './prospects/ProspectHeader';
import { ProspectListContent } from './prospects/ProspectListContent';

export const ProspectList = () => {
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
        title: "Rendez-vous découverte",
        description: "Premier contact avec le prospect",
        date: new Date(),
        duration: 60,
        type: 'discovery',
        status: 'scheduled',
        lead_id: prospectId
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
      Notes: ${prospect.notes || 'Aucune note'}`;

      const strategy = await AIService.generateContent('description', prompt);
      
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

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    loadProspects();
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
      <ProspectHeader
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        onAddSuccess={handleAddSuccess}
        onImportSuccess={loadProspects}
      />
      
      <ProspectTabs
        prospects={prospects}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <ProspectListContent
          prospects={filteredProspects}
          isLoading={isLoading}
          onScheduleMeeting={handleScheduleMeeting}
          onGenerateStrategy={generateStrategy}
          isGeneratingStrategy={isGeneratingStrategy}
          getQualificationColor={getQualificationColor}
        />
      </ProspectTabs>
    </Card>
  );
};