import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

export const WorkflowView = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: automations, isLoading } = useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleNewAutomation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une automatisation.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("automations")
        .insert({
          user_id: user.id,
          name: "Nouvelle automatisation",
          trigger_type: "lead_created",
          trigger_config: {},
          actions: [],
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["automations"] });
      
      toast({
        title: "Automatisation créée",
        description: "La nouvelle automatisation a été créée avec succès.",
      });
    } catch (error) {
      console.error("Error creating automation:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'automatisation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Automatisations</h2>
        <Button onClick={handleNewAutomation}>Nouvelle automatisation</Button>
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