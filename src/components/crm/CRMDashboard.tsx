import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  Brain,
  Sparkles,
  Bot
} from 'lucide-react';

export const CRMDashboard = () => {
  const { toast } = useToast();

  const { data: leadsData } = useQuery({
    queryKey: ['leads-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Récupérer les leads avec leurs qualifications et interactions
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tableau de Bord CRM</h2>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          IA Active
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
              <p className="text-2xl font-bold">{metrics.totalLeads}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Contacts Qualifiés</p>
              <p className="text-2xl font-bold">{metrics.qualifiedLeads}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Interactions Actives</p>
              <p className="text-2xl font-bold">{metrics.activeInteractions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Taux de Conversion</p>
              <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Distribution des Contacts</h3>
            <Bot className="w-5 h-5 text-blue-500" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, aiScore }) => 
                    `${name} (${value}) - Score IA: ${aiScore}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualificationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recommandations IA</h3>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {metrics.nextActions?.map((action, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{action.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <Badge variant="outline">
                  Priorité: {action.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Fonctions utilitaires pour l'IA
const calculateAIEngagementScore = (interactions: any[]) => {
  if (!interactions?.length) return 0;
  // Logique de calcul du score d'engagement basé sur les interactions
  return Math.round(interactions.reduce((acc, int) => {
    const baseScore = int.status === 'active' ? 1 : 0.5;
    const recencyBonus = isRecent(int.created_at) ? 0.3 : 0;
    return acc + baseScore + recencyBonus;
  }, 0) / interactions.length * 100);
};

const calculateAIScore = (qualification: string, leads: any[]) => {
  if (!leads?.length) return 0;
  const qualifiedLeads = leads.filter(l => l.qualification === qualification);
  return Math.round((qualifiedLeads.length / leads.length) * 100);
};

const generateAIRecommendations = (leads: any[]) => {
  if (!leads?.length) return [];
  
  const recommendations = [];
  
  // Analyse des leads froids
  const coldLeads = leads.filter(l => l.status === 'cold');
  if (coldLeads.length > 0) {
    recommendations.push({
      type: 'Réactivation',
      description: `${coldLeads.length} leads inactifs à recontacter`,
      priority: 'Haute'
    });
  }

  // Analyse des prospects qualifiés
  const qualifiedLeads = leads.filter(l => l.qualification === 'prospect' && l.score > 70);
  if (qualifiedLeads.length > 0) {
    recommendations.push({
      type: 'Conversion',
      description: `${qualifiedLeads.length} prospects hautement qualifiés`,
      priority: 'Urgente'
    });
  }

  return recommendations;
};

const isRecent = (date: string) => {
  const now = new Date();
  const interactionDate = new Date(date);
  const daysDiff = Math.floor((now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 7;
};