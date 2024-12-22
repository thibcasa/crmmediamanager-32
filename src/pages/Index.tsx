import { AppLayout } from "@/components/layout/AppLayout";
import { LeadList } from "@/components/leads/LeadList";
import { SocialCampaigns } from "@/components/SocialCampaigns";
import { CalendarView } from "@/components/calendar/CalendarView";
import { WorkflowView } from "@/components/workflow/WorkflowView";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SocialCampaigns />
            <LeadList />
          </div>
          <div className="space-y-8">
            <CalendarView />
            <WorkflowView />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;