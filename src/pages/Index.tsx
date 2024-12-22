import { AppLayout } from "@/components/layout/AppLayout";
import { CampaignWorkflow } from "@/components/social/CampaignWorkflow";

const Index = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Bienvenue sur votre CRM Immobilier
          </h1>
          <p className="text-muted-foreground mt-2">
            Commencez par configurer votre stratégie de prospection
          </p>
        </div>

        <CampaignWorkflow />
      </div>
    </AppLayout>
  );
};

export default Index;