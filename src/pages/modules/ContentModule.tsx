import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentModule() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Module Rédaction</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Contenu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Module en cours de développement</p>
        </CardContent>
      </Card>
    </div>
  );
}