import { AppLayout } from "@/components/layout/AppLayout";
import { WorkflowView } from "@/components/workflow/WorkflowView";

const Workflow = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Workflow</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos processus et automatisations.
          </p>
        </div>
        <WorkflowView />
      </div>
    </AppLayout>
  );
};

export default Workflow;