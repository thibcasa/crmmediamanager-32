import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export const AIPerformanceStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['ai-performance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const successRate = data.filter(log => log.status === 'completed').length / data.length * 100;
      
      return {
        totalInteractions: data.length,
        successRate: successRate.toFixed(1),
        recentLogs: data.slice(0, 5)
      };
    }
  });

  if (isLoading) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Performance de l'Assistant IA</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Interactions totales</div>
          <div className="text-2xl font-bold">{stats?.totalInteractions || 0}</div>
        </Card>
        
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Taux de réussite</div>
          <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Dernières interactions</h3>
        <div className="space-y-2">
          {stats?.recentLogs.map((log, index) => (
            <Card key={index} className="p-3">
              <div className="text-sm">{log.description}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(log.created_at).toLocaleString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};