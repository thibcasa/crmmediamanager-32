import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Building2, TrendingUp, Brain } from "lucide-react";

const stats = [
  {
    label: "Prospects Actifs",
    value: "234",
    icon: Users,
    trend: "+12%",
    color: "text-sage-500",
  },
  {
    label: "Propriétés",
    value: "89",
    icon: Building2,
    trend: "+5%",
    color: "text-sage-500",
  },
  {
    label: "Taux de Conversion",
    value: "8.5%",
    icon: TrendingUp,
    trend: "+2.4%",
    color: "text-sage-500",
  },
  {
    label: "Score IA Moyen",
    value: "7.8/10",
    icon: Brain,
    trend: "+0.6",
    color: "text-sage-500",
  },
];

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">
            Bienvenue sur votre espace de gestion immobilière intelligent.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 animate-slideIn hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-sage-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <span className="text-sm text-green-500">{stat.trend}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Prospects Récents</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-sage-200" />
                  <div>
                    <p className="font-medium">Client {i}</p>
                    <p className="text-sm text-muted-foreground">Dernier contact: il y a {i} jour{i > 1 ? 's' : ''}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-1 text-xs rounded-full bg-sage-100 text-sage-700">
                      Score: {9 - i}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Propriétés Populaires</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-sage-50 transition-colors">
                  <div className="w-16 h-12 rounded-lg bg-sage-200" />
                  <div>
                    <p className="font-medium">Appartement {i}</p>
                    <p className="text-sm text-muted-foreground">{3 + i} pièces - {60 + i * 10}m²</p>
                  </div>
                  <div className="ml-auto">
                    <p className="font-semibold">{300 + i * 50}k€</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;