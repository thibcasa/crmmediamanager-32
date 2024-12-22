import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AIService } from "@/services/AIService";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LinkedInStatus } from "@/components/linkedin/LinkedInStatus";
import { ExamplePrompts } from "@/components/ai-chat/ExamplePrompts";
import { ChatMessages } from "@/components/ai-chat/ChatMessages";
import { ChatInput } from "@/components/ai-chat/ChatInput";
import { supabase } from "@/lib/supabaseClient";

const AiChat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const executeWorkflow = async (aiResponse: string) => {
    try {
      // 1. Générer une image avec HuggingFace
      const { data: visualData, error: visualError } = await supabase.functions.invoke('huggingface-integration', {
        body: { 
          action: 'generate-image',
          data: { prompt: "Professional real estate photo in Nice, French Riviera, modern style" }
        }
      });

      if (visualError) throw visualError;

      // 2. Créer une campagne sociale
      const { data: campaignData, error: campaignError } = await supabase
        .from('social_campaigns')
        .insert({
          name: "Campagne LinkedIn Nice - Propriétaires",
          platform: 'linkedin',
          status: 'active',
          targeting_criteria: {
            location: "Nice, Alpes-Maritimes",
            age_range: "35-65",
            job_titles: ["Cadre", "Manager", "Directeur"],
            interests: ["Immobilier", "Investissement"]
          },
          message_template: aiResponse
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 3. Créer un pipeline de suivi
      const { data: pipelineData, error: pipelineError } = await supabase
        .from('pipelines')
        .insert({
          name: "Pipeline LinkedIn Nice",
          description: "Suivi des prospects LinkedIn - Propriétaires Nice",
          stages: [
            {
              name: "Premier contact",
              criteria: { source: "linkedin", status: "new" }
            },
            {
              name: "Intéressé",
              criteria: { engagement_score: ">50" }
            },
            {
              name: "Rendez-vous",
              criteria: { meeting_scheduled: true }
            },
            {
              name: "Estimation",
              criteria: { property_evaluated: true }
            }
          ]
        })
        .select()
        .single();

      if (pipelineError) throw pipelineError;

      // 4. Créer une automatisation
      const { data: automationData, error: automationError } = await supabase
        .from('automations')
        .insert({
          name: "Suivi LinkedIn Nice",
          trigger_type: "lead_created",
          trigger_config: { source: "linkedin" },
          actions: [
            {
              type: "send_message",
              template: "follow_up_linkedin",
              delay: "2d"
            },
            {
              type: "create_task",
              template: "qualification_call",
              delay: "4d"
            }
          ],
          is_active: true
        })
        .select()
        .single();

      if (automationError) throw automationError;

      // 5. Poster sur LinkedIn
      await AIService.generateAndPostToLinkedIn(aiResponse);

      // 6. Rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['social-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['pipelines'] });
      queryClient.invalidateQueries({ queryKey: ['automations'] });

      toast({
        title: "Workflow complet exécuté",
        description: "Campagne créée, pipeline configuré et automatisations mises en place.",
      });

    } catch (error) {
      console.error('Erreur dans l\'exécution du workflow:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution du workflow.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `Tu es un expert en stratégie immobilière et marketing digital pour les Alpes-Maritimes.
      Pour chaque demande, tu dois :
      1. Analyser l'objectif et proposer une stratégie détaillée
      2. Créer un plan d'action concret avec :
         - Messages et contenus spécifiques pour chaque réseau social
         - Séquences d'automatisation et workflows
         - Templates de messages personnalisés
         - Suggestions de visuels et créatifs
      3. Définir les KPIs et métriques de suivi
      4. Proposer un calendrier d'actions
      
      Sois précis et actionnable dans tes recommandations.
      Priorise les actions à fort impact et propose des modèles de messages.`;
      
      const response = await AIService.generateContent('description', `${systemPrompt}\n\nObjectif: ${userMessage}`);
      
      const assistantMessage = typeof response === 'string' ? response : 
        (response?.content ? response.content : JSON.stringify(response));
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Exécuter le workflow complet
      await executeWorkflow(assistantMessage);

    } catch (error) {
      console.error("Error generating strategy:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les recommandations pour le moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-sage-900">Assistant Stratégique Immobilier</h1>
          <p className="text-sage-600 mt-3 text-lg">
            Je coordonne vos stratégies de prospection et génère du contenu pour tous vos canaux
          </p>
        </div>

        <Card className="p-6 bg-white shadow-sm border-sage-200">
          <h2 className="text-xl font-semibold text-sage-800 mb-4">Connexion LinkedIn</h2>
          <LinkedInStatus />
        </Card>

        <ExamplePrompts onPromptClick={setInput} />

        <Card className="flex flex-col h-[600px] border-sage-200 shadow-sm overflow-hidden">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default AiChat;