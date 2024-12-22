import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { PipelineStage } from "./PipelineStage";
import { PipelineHeader } from "./PipelineHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const PipelineView = () => {
  const { data: stages, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[600px] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PipelineHeader />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stages?.map((stage) => (
          <PipelineStage key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
};