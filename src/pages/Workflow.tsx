import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";

const Workflow = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Créez et gérez vos campagnes marketing étape par étape.
          </p>
        </div>
        <WorkflowSteps />
      </div>
    </AppLayout>
  );
};

export default Workflow;