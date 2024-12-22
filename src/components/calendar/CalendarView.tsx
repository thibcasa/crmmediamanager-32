import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card className="p-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Événements du jour</h3>
          {isLoading ? (
            <p>Chargement des événements...</p>
          ) : events?.length === 0 ? (
            <p className="text-muted-foreground">Aucun événement prévu.</p>
          ) : (
            <div className="space-y-2">
              {events?.map((event) => (
                <Card key={event.id} className="p-3">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleTimeString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};