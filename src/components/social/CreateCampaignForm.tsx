import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SocialCampaignService } from '@/services/SocialCampaignService';
import { LinkedInStatus } from '../linkedin/LinkedInStatus';
import { supabase } from '@/lib/supabaseClient';
import { SocialPlatform } from '@/types/social';
import { platformTemplates } from './utils/platformTemplates';
import { CampaignTargeting } from './campaign/CampaignTargeting';
import { CampaignSchedule } from './campaign/CampaignSchedule';
import { PersonaSelector } from './campaign/PersonaSelector';
import { SocialPlatformSelector } from './campaign/SocialPlatformSelector';
import { MessageTemplateForm } from './campaign/MessageTemplateForm';

interface CreateCampaignFormProps {
  onSuccess: () => void;
}

export const CreateCampaignForm = ({ onSuccess }: CreateCampaignFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('Test LinkedIn - Propriétaires Nice');
  const [platform, setPlatform] = useState<SocialPlatform>('linkedin');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin']);
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

  const handlePlatformChange = (value: SocialPlatform) => {
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
        },
        current_prediction: {},
        optimization_cycles: [],
        advanced_metrics: {
          sentiment: { neutral: 0, negative: 0, positive: 0 },
          demographicData: { ageRanges: {}, locations: {}, genderDistribution: {} },
          interactionTimeline: []
        },
        reach: 0,
        engagement_rate: 0,
        conversion_rate: 0,
        roi: 0
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
      setSelectedPlatforms(['linkedin']);
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
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

      <SocialPlatformSelector 
        platform={platform}
        onPlatformChange={handlePlatformChange}
      />

      <PersonaSelector
        selectedPersonaId={selectedPersonaId}
        onPersonaSelect={setSelectedPersonaId}
      />

      <CampaignTargeting
        selectedLocations={selectedLocations}
        onLocationsChange={setSelectedLocations}
        selectedPlatforms={selectedPlatforms}
        onPlatformsChange={setSelectedPlatforms}
        targetingCriteria={targetingCriteria}
        onTargetingChange={setTargetingCriteria}
      />

      <MessageTemplateForm
        messageTemplate={messageTemplate}
        onMessageTemplateChange={setMessageTemplate}
      />

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
