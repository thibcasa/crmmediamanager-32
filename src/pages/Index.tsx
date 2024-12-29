import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Building2, Loader2 } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { ActiveCampaigns } from "@/components/campaigns/ActiveCampaigns";

const Index = () => {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
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
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Erreur d'authentification</h1>
        <p>Veuillez vous connecter pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard CRM Immobilier
        </h1>
        <p className="text-xl text-muted-foreground">
          Gérez vos campagnes et suivez vos performances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Campagnes en cours</h3>
              <p className="text-sm text-muted-foreground">Gérer vos campagnes actives</p>
            </div>
          </div>
        </Card>
      </div>

      <ActiveCampaigns />
    </div>
  );
};

export default Index;