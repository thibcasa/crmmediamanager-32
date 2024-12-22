import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PipelineStage } from "./PipelineStage";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const PipelineBoard = () => {
  const { toast } = useToast();

  const { data: stages, isLoading: isLoadingStages } = useQuery({
    queryKey: ["pipeline-stages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pipeline_stages")
        .select("*")
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  const handleGeneratePipeline = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-pipeline');
      
      if (error) throw error;

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
    }
  };

  if (isLoadingStages) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[600px] w-full" />
        ))}
      </div>
    );
  }

  if (!stages?.length) {
    return (
      <Card className="p-6 text-center">
        <p className="mb-4">Aucun pipeline n'a été configuré.</p>
        <Button onClick={handleGeneratePipeline}>
          <Plus className="w-4 h-4 mr-2" />
          Générer un pipeline avec l'IA
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stages.map((stage) => (
        <PipelineStage key={stage.id} stage={stage} />
      ))}
    </div>
  );
};