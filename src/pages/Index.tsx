import { Card } from "@/components/ui/card";
import { Building2, Loader2 } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ActiveCampaigns } from "@/components/campaigns/ActiveCampaigns";

const Index = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Bonjour {user.email}
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos campagnes en cours
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Campagnes</h3>
              <p className="text-sm text-muted-foreground">Gérez vos campagnes marketing</p>
            </div>
          </div>
        </Card>
      </div>

      <ActiveCampaigns />
    </div>
  );
};

export default Index;