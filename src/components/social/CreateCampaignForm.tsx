import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService, Platform } from '@/services/SocialCampaignService';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { LinkedInStatus } from '../linkedin/LinkedInStatus';
import { supabase } from '@/lib/supabaseClient';

// Move templates to a separate file for better organization
import { platformTemplates } from './utils/platformTemplates';
import { CampaignTargeting } from './campaign/CampaignTargeting';
import { CampaignSchedule } from './campaign/CampaignSchedule';
import { PersonaSelector } from './campaign/PersonaSelector';

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('Test LinkedIn - Propriétaires Nice');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [messageTemplate, setMessageTemplate] = useState(platformTemplates.linkedin);
  const [targetingCriteria, setTargetingCriteria] = useState({
    location: "Nice, Alpes-Maritimes",
    jobTitles: ["Propriétaire", "Investisseur immobilier"],
    industries: ["Real Estate", "Property Management"],
    keywords: ["propriétaire", "immobilier", "investissement"]
  });
  const [schedule, setSchedule] = useState({
    frequency: "daily",
    times: ["09:00", "14:00", "17:00"],
    days: ["monday", "wednesday", "friday"]
  });
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setMessageTemplate(platformTemplates[value] || '');
  };

  const handleCreateCampaign = async () => {
    if (!selectedPersonaId) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un persona",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour créer une campagne",
          variant: "destructive"
        });
        return;
      }

      const campaignData = {
        name,
        platform,
        message_template: messageTemplate,
        targeting_criteria: targetingCriteria,
        status: 'draft',
        schedule: schedule,
        user_id: user.id,
        posts: [],
        post_triggers: [],
        target_metrics: {},
        ai_feedback: null,
        persona_id: selectedPersonaId,
        target_locations: selectedLocations,
        content_strategy: {
          post_types: ["image", "carousel"],
          posting_frequency: "daily",
          best_times: ["09:00", "12:00", "17:00"],
          content_themes: ["property_showcase"]
        }
      };

      await SocialCampaignService.createCampaign(campaignData);
      
      onSuccess();
      toast({
        title: "Succès",
        description: "Campagne créée avec succès"
      });

      // Reset form
      setName('');
      setMessageTemplate('');
      setTargetingCriteria({
        location: "",
        jobTitles: [],
        industries: [],
        keywords: []
      });
      setSchedule({
        frequency: "daily",
        times: [],
        days: []
      });
      setSelectedPersonaId(null);
      setSelectedLocations([]);
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la campagne",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <LinkedInStatus />

      <div>
        <label className="block text-sm font-medium mb-2">Nom de la campagne</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Prospection LinkedIn Q2 2024"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Plateforme</label>
        <Select value={platform} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une plateforme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </div>
            </SelectItem>
            <SelectItem value="whatsapp">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </div>
            </SelectItem>
            <SelectItem value="facebook">
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </div>
            </SelectItem>
            <SelectItem value="instagram">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PersonaSelector
        selectedPersonaId={selectedPersonaId}
        onPersonaSelect={setSelectedPersonaId}
      />

      <CampaignTargeting
        selectedLocations={selectedLocations}
        onLocationsChange={setSelectedLocations}
        targetingCriteria={targetingCriteria}
        onTargetingChange={setTargetingCriteria}
      />

      <div>
        <label className="block text-sm font-medium mb-2">Template de message</label>
        <Textarea
          value={messageTemplate}
          onChange={(e) => setMessageTemplate(e.target.value)}
          placeholder="Bonjour {first_name}, je vois que vous êtes propriétaire..."
          className="min-h-[200px]"
        />
      </div>

      <CampaignSchedule
        schedule={schedule}
        onChange={setSchedule}
      />

      <Button 
        onClick={handleCreateCampaign} 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Création en cours...' : 'Créer la campagne'}
      </Button>
    </div>
  );
};