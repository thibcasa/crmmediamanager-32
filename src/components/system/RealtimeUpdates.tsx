import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const RealtimeUpdates = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Canal pour les mises à jour des leads
    const leadsChannel = supabase
      .channel('db-leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('Mise à jour des leads:', payload);
          toast({
            title: "Mise à jour des leads",
            description: "De nouvelles données sont disponibles",
          });
        }
      )
      .subscribe();

    // Canal pour les mises à jour des campagnes
    const campaignsChannel = supabase
      .channel('db-campaigns-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_campaigns' },
        (payload) => {
          console.log('Mise à jour des campagnes:', payload);
          toast({
            title: "Mise à jour des campagnes",
            description: "De nouvelles données sont disponibles",
          });
        }
      )
      .subscribe();

    // Canal pour les mises à jour des interactions
    const interactionsChannel = supabase
      .channel('db-interactions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lead_interactions' },
        (payload) => {
          console.log('Mise à jour des interactions:', payload);
          toast({
            title: "Mise à jour des interactions",
            description: "De nouvelles données sont disponibles",
          });
        }
      )
      .subscribe();

    // Nettoyage des souscriptions
    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(interactionsChannel);
    };
  }, []);

  return null; // Composant invisible
};