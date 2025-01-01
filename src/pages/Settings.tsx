import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration du CRM</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page en cours de développement</p>
        </CardContent>
      </Card>
    </div>
  );
}