import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkflowModule() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Module Workflow</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Module en cours de développement</p>
        </CardContent>
      </Card>
    </div>
  );
}