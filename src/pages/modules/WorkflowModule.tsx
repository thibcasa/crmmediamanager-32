import { Card } from "@/components/ui/card";
import { WorkflowOrchestrator } from "@/components/modules/WorkflowOrchestrator";

export default function WorkflowModule() {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Module Workflow</h1>
      <WorkflowOrchestrator />
    </div>
  );
}