import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tableau de Bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Nombre total de prospects: 0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campagnes Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Campagnes en cours: 0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Taux d'engagement: 0%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}