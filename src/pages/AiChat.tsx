import { useState } from 'react';
import { ChatMessages } from '@/components/ai-chat/ChatMessages';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { CampaignWorkflowManager } from '@/components/ai-chat/campaign-workflow/CampaignWorkflowManager';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CampaignData {
  objective: string;
  creatives: Array<{
    type: 'image' | 'video';
    url: string;
    format: string;
  }>;
  content: Array<{
    type: 'post' | 'story' | 'reel' | 'article';
    text: string;
  }>;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    objective: '',
    creatives: [],
    content: []
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Generate campaign content
      console.log('Generating campaign content...');
      const { data: campaignResponse, error: campaignError } = await supabase.functions.invoke('content-generator', {
        body: {
          prompt: input,
          type: 'campaign',
          targetAudience: "propriétaires immobiliers Alpes-Maritimes",
          tone: "professionnel et stratégique"
        }
      });

      if (campaignError) {
        console.error('Campaign generation error:', campaignError);
        throw campaignError;
      }

      // Generate creative visuals
      console.log('Generating creative visuals...');
      const { data: creativesData, error: creativesError } = await supabase.functions.invoke('openai-image-generation', {
        body: {
          prompt: `Professional real estate marketing visual for: ${input}`,
          n: 2,
          size: "1024x1024",
          quality: "standard",
          style: "natural"
        }
      });

      if (creativesError) {
        console.error('Creatives generation error:', creativesError);
        throw creativesError;
      }

      if (!creativesData?.images) {
        console.error('Invalid creatives data:', creativesData);
        throw new Error('Format de réponse invalide pour les créatives');
      }

      // Update campaign data
      const updatedCampaignData = {
        objective: input,
        creatives: creativesData.images.map((url: string) => ({
          type: 'image',
          url,
          format: 'linkedin'
        })),
        content: [
          {
            type: 'post',
            text: campaignResponse.content
          }
        ]
      };

      console.log('Setting campaign data:', updatedCampaignData);
      setCampaignData(updatedCampaignData);

      // Add assistant response
      const assistantMessage = {
        role: 'assistant' as const,
        content: `J'ai généré une campagne basée sur votre demande. Vous pouvez voir les créatives et le contenu dans le panneau de droite. Voici un résumé de la stratégie proposée :\n\n${campaignResponse.content}`
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Campagne générée",
        description: "Les créatives et le contenu ont été générés avec succès.",
      });

    } catch (error) {
      console.error('Error generating campaign:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la campagne. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Assistant IA</h1>
        <p className="text-muted-foreground mt-2">
          Générez et optimisez vos campagnes marketing pour l'immobilier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[600px]">
          <ChatMessages messages={messages} isLoading={isLoading} />
          <ChatInput 
            input={input}
            isLoading={isLoading}
            onInputChange={(value) => setInput(value)}
            onSubmit={handleSubmit}
          />
        </Card>

        <div className="space-y-6">
          <CampaignWorkflowManager 
            initialData={campaignData}
            onUpdate={(updates) => setCampaignData(prev => ({ ...prev, ...updates }))}
          />
        </div>
      </div>
    </div>
  );
};

export default AiChat;