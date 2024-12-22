import { AppLayout } from "@/components/layout/AppLayout";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";

const Pipeline = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Pipeline de vente</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos prospects à travers les différentes étapes de votre processus de vente.
          </p>
        </div>
        <PipelineBoard />
      </div>
    </AppLayout>
  );
};

export default Pipeline;