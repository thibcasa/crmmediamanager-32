import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ModuleOverview } from "./modules/ModuleOverview";
import { CampaignMetrics } from "./metrics/CampaignMetrics";
import { ModuleNavigation } from "./navigation/ModuleNavigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export const GlobalDashboard = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['social-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de Bord Global</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModuleOverview />
        <CampaignMetrics campaigns={campaigns || []} />
        <ModuleNavigation />
      </div>
    </div>
  );
};