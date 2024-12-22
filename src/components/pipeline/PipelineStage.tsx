import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarIcon, 
  MailIcon, 
  PhoneIcon,
  UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("pipeline_stage_id", stage.id)
        .eq("user_id", user.id)
        .order("last_contact_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="min-h-[600px]">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-base">
          <span>{stage.name}</span>
          <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {leads?.length || 0}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leads?.map((lead) => (
          <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-medium flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  {lead.first_name} {lead.last_name}
                </div>
                <span className={`${getScoreColor(lead.score)} font-medium`}>
                  {lead.score}
                </span>
              </div>
              
              <div className="text-sm space-y-1 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MailIcon className="w-3 h-3" />
                  {lead.email}
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-3 h-3" />
                    {lead.phone}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3 h-3" />
                  {format(new Date(lead.last_contact_date), 'dd MMM yyyy', { locale: fr })}
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Détails
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};