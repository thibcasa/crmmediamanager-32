import { AppLayout } from "@/components/layout/AppLayout";
import { LeadList } from "@/components/leads/LeadList";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-2">
            Gérez et analysez vos leads immobiliers.
          </p>
        </div>

        <LeadList />
      </div>
    </AppLayout>
  );
};

export default Index;