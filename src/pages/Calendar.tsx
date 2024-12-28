import { CalendarView } from "@/components/calendar/CalendarView";

const Calendar = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Calendrier</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos rendez-vous et événements immobiliers.
        </p>
      </div>
      <CalendarView />
    </div>
  );
};

export default Calendar;