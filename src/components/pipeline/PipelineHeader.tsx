import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const PipelineHeader = () => {
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
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle étape
      </Button>
    </div>
  );
};