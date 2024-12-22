import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface PipelineStageProps {
  stage: {
    id: string;
    name: string;
    order_index: number;
  };
}

export const PipelineStage = ({ stage }: PipelineStageProps) => {
  const { data: leads } = useQuery({
    queryKey: ["stage-leads", stage.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("pipeline_stage_id", stage.id);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{stage.name}</span>
          <span className="text-sm text-muted-foreground">
            {leads?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leads?.map((lead) => (
          <Card key={lead.id} className="p-4">
            <div className="font-medium">
              {lead.first_name} {lead.last_name}
            </div>
            <div className="text-sm text-muted-foreground">{lead.email}</div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};