import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export const PipelineHeader = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAddStage = async () => {
    try {
      // Get the current number of stages to determine the new order_index
      const { data: existingStages } = await supabase
        .from("pipeline_stages")
        .select("order_index")
        .order("order_index", { ascending: false })
        .limit(1);

      const newOrderIndex = existingStages && existingStages[0] 
        ? existingStages[0].order_index + 1 
        : 0;

      const { error } = await supabase
        .from("pipeline_stages")
        .insert({
          name: "Nouvelle étape",
          order_index: newOrderIndex,
          automation_rules: [],
          required_actions: [],
          next_stage_conditions: {}
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["pipeline-stages"] });
      
      toast({
        title: "Étape créée",
        description: "La nouvelle étape a été ajoutée avec succès.",
      });
    } catch (error) {
      console.error("Error adding stage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la nouvelle étape.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Étapes du pipeline
        </h2>
        <p className="text-sm text-muted-foreground">
          Visualisez et gérez vos prospects à chaque étape
        </p>
      </div>
      <Button onClick={handleAddStage}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle étape
      </Button>
    </div>
  );
};