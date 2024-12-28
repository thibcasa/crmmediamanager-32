import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
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
import { Users, Target, TrendingUp, MessageSquare } from 'lucide-react';

export const CRMDashboard = () => {
  const { toast } = useToast();

  const { data: leadsData } = useQuery({
    queryKey: ['leads-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Récupérer les leads avec leurs qualifications
      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_interactions (
            type,
            status,
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
            qualification
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
  });

  // Calcul des métriques
  const metrics = {
    totalLeads: leadsData?.length || 0,
    qualifiedLeads: leadsData?.filter(l => l.qualification === 'prospect').length || 0,
    activeInteractions: interactionsData?.filter(i => i.status === 'active').length || 0,
    conversionRate: leadsData?.length 
      ? ((leadsData.filter(l => l.qualification === 'client').length / leadsData.length) * 100).toFixed(1)
      : 0
  };

  // Données pour le graphique de qualification
  const qualificationData = [
    { name: 'Leads', value: leadsData?.filter(l => l.qualification === 'lead').length || 0 },
    { name: 'Prospects', value: leadsData?.filter(l => l.qualification === 'prospect').length || 0 },
    { name: 'Clients', value: leadsData?.filter(l => l.qualification === 'client').length || 0 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Tableau de Bord CRM</h2>
      
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
          <h3 className="text-lg font-medium mb-4">Distribution des Contacts</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
          <h3 className="text-lg font-medium mb-4">Activité Récente</h3>
          <div className="space-y-4">
            {interactionsData?.slice(0, 5).map((interaction) => (
              <div key={interaction.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{interaction.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(interaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge>
                  {interaction.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};