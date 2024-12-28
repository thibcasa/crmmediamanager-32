import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { Brain } from 'lucide-react';
import { MetricsGrid } from './metrics/MetricsGrid';
import { ContactDistribution } from './analytics/ContactDistribution';
import { AIRecommendations } from './recommendations/AIRecommendations';
import { 
  calculateAIEngagementScore, 
  calculateAIScore,
  generateAIRecommendations 
} from './utils/aiMetrics';

export const CRMDashboard = () => {
  const { toast } = useToast();

  const { data: leadsData } = useQuery({
    queryKey: ['leads-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_interactions (
            type,
            status,
            content,
            metadata,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return leads;
    },
  });

  const { data: interactionsData } = useQuery({
    queryKey: ['interactions-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('lead_interactions')
        .select(`
          *,
          leads (
            qualification,
            score
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  // Calcul des métriques avec l'IA
  const metrics = {
    totalLeads: leadsData?.length || 0,
    qualifiedLeads: leadsData?.filter(l => l.qualification === 'prospect').length || 0,
    activeInteractions: interactionsData?.filter(i => i.status === 'active').length || 0,
    conversionRate: leadsData?.length 
      ? ((leadsData.filter(l => l.qualification === 'client').length / leadsData.length) * 100).toFixed(1)
      : 0,
    aiEngagementScore: calculateAIEngagementScore(interactionsData),
    nextActions: generateAIRecommendations(leadsData)
  };

  // Données pour le graphique de qualification avec insights IA
  const qualificationData = [
    { 
      name: 'Leads', 
      value: leadsData?.filter(l => l.qualification === 'lead').length || 0,
      aiScore: calculateAIScore('lead', leadsData)
    },
    { 
      name: 'Prospects', 
      value: leadsData?.filter(l => l.qualification === 'prospect').length || 0,
      aiScore: calculateAIScore('prospect', leadsData)
    },
    { 
      name: 'Clients', 
      value: leadsData?.filter(l => l.qualification === 'client').length || 0,
      aiScore: calculateAIScore('client', leadsData)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tableau de Bord CRM</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          IA Active
        </Badge>
      </div>
      
      <MetricsGrid metrics={metrics} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactDistribution data={qualificationData} />
        <AIRecommendations recommendations={metrics.nextActions} />
      </div>
    </div>
  );
};