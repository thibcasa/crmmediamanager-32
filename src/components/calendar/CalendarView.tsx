import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: events, isLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          leads (
            first_name,
            last_name
          )
        `)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const filteredEvents = events?.filter((event) => {
    if (!date) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      discovery: "Découverte",
      follow_up: "Suivi",
      closing: "Signature",
      general: "Général",
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card className="p-4">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
          locale={fr}
        />
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Événements du{" "}
            {date && format(date, "d MMMM yyyy", { locale: fr })}
          </h3>
          {isLoading ? (
            <p>Chargement des événements...</p>
          ) : filteredEvents?.length === 0 ? (
            <p className="text-muted-foreground">Aucun événement prévu.</p>
          ) : (
            <div className="space-y-3">
              {filteredEvents?.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {event.title}
                        {event.leads && (
                          <span className="text-sm text-muted-foreground ml-2">
                            avec {event.leads.first_name} {event.leads.last_name}
                          </span>
                        )}
                      </h4>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status === "scheduled"
                          ? "Planifié"
                          : event.status === "completed"
                          ? "Terminé"
                          : "Annulé"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        {format(new Date(event.date), "HH:mm", { locale: fr })} (
                        {event.duration} minutes)
                      </p>
                      <p>Type: {getTypeLabel(event.type)}</p>
                      {event.description && <p>{event.description}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};