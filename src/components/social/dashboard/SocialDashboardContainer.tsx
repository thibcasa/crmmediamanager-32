import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { ActionButtons } from './ActionButtons';
import { NavigationMenu } from './NavigationMenu';
import { supabase } from '@/lib/supabaseClient';

export const SocialDashboardContainer = () => {
  const { toast } = useToast();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['social-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <Card className="p-6">
      <NavigationMenu />
      <div className="mt-6 space-y-6">
        <ActionButtons 
          onRefresh={() => {
            toast({
              title: "Rafraîchissement",
              description: "Les données ont été mises à jour"
            });
          }}
        />
        {/* Content will be added here */}
      </div>
    </Card>
  );
};