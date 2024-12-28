import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessages } from '@/components/ai-chat/ChatMessages';
import { ChatInput } from '@/components/ai-chat/ChatInput';
import { CampaignWorkflowManager } from '@/components/ai-chat/campaign-workflow/CampaignWorkflowManager';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaignData, setCampaignData] = useState({
    objective: '',
    creatives: [],
    content: []
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur de vérification de session:', error);
          throw error;
        }
        
        if (!session) {
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        // Écouter les changements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!session) {
            navigate('/login');
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de l'authentification",
          variant: "destructive",
        });
        navigate('/login');
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      // Ajouter le message de l'utilisateur
      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Simuler une réponse de l'assistant (à remplacer par votre logique réelle)
      const assistantMessage = {
        role: 'assistant' as const,
        content: `J'ai bien reçu votre message : "${input}". Je vais traiter votre demande.`
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Message envoyé",
        description: "Votre message a été traité avec succès.",
      });

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
      </div>
    );
  }

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