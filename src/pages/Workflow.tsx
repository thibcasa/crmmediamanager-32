import { AppLayout } from "@/components/layout/AppLayout";
import { AutomationWorkflow } from "@/components/workflow/AutomationWorkflow";

const Workflow = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Workflow Marketing</h1>
          <p className="text-muted-foreground mt-2">
            Automatisez et optimisez vos campagnes marketing avec l'IA
          </p>
        </div>
        <AutomationWorkflow />
      </div>
    </AppLayout>
  );
};

export default Workflow;