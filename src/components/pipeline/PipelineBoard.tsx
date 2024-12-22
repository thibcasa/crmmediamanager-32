import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PipelineStage } from "./PipelineStage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PipelineHeader } from "./PipelineHeader";
import { useState } from "react";

export const PipelineBoard = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: stages, isLoading: isLoadingStages, refetch: refetchStages } = useQuery({
    queryKey: ["pipeline-stages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq('user_id', user.id)
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  const handleGeneratePipeline = async () => {
    try {
      setIsGenerating(true);
      // Get the session before making the function call
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) {
        toast({
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-pipeline', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;

      // Refresh the stages data after generation
      await refetchStages();

      toast({
        title: "Pipeline généré",
        description: "Le pipeline et les automatisations ont été créés avec succès.",
      });
    } catch (error) {
      console.error('Error generating pipeline:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le pipeline.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingStages) {
    return (
      <div className="space-y-8">
        <PipelineHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[600px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!stages?.length) {
    return (
      <div className="space-y-8">
        <PipelineHeader />
        <Card className="p-6 text-center">
          <p className="mb-4">Aucun pipeline n'a été configuré.</p>
          <Button 
            onClick={handleGeneratePipeline}
            disabled={isGenerating}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isGenerating ? 'Génération en cours...' : 'Générer un pipeline avec l\'IA'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PipelineHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <PipelineStage key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
};