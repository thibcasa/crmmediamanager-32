import { Card } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { Users, Building2, TrendingUp, Brain } from "lucide-react";
import { LeadScraper } from "@/components/LeadScraper";
import { EmailCampaign } from "@/components/EmailCampaign";
import { ProspectList } from "@/components/ProspectList";

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
          <LeadScraper />
          <EmailCampaign />
        </div>

        <div className="w-full">
          <ProspectList />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;