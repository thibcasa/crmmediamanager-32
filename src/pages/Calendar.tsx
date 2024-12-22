import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarView } from "@/components/calendar/CalendarView";

const Calendar = () => {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Calendrier</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos rendez-vous et événements immobiliers.
          </p>
        </div>
        <CalendarView />
      </div>
    </AppLayout>
  );
};

export default Calendar;