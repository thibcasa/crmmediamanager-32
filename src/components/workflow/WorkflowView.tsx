import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export const WorkflowView = () => {
  const { data: automations, isLoading } = useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Automatisations</h2>
        <Button>Nouvelle automatisation</Button>
      </div>

      {isLoading ? (
        <p>Chargement des automatisations...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {automations?.map((automation) => (
            <Card key={automation.id} className="p-4">
              <h3 className="font-medium">{automation.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Type: {automation.trigger_type}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm ${automation.is_active ? "text-green-500" : "text-red-500"}`}>
                  {automation.is_active ? "Actif" : "Inactif"}
                </span>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};