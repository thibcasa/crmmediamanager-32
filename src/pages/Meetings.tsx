import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Meetings = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          leads (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching meetings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les rendez-vous",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Gérez vos rendez-vous avec les prospects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-4">
        {meetings?.map((meeting) => (
          <Card key={meeting.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{meeting.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(meeting.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {meeting.leads && (
                  <div className="mt-2">
                    <p className="text-sm">
                      Contact: {meeting.leads.first_name} {meeting.leads.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.leads.email} • {meeting.leads.phone}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Durée: {meeting.duration} min
              </div>
            </div>
            {meeting.description && (
              <p className="mt-2 text-sm">{meeting.description}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Meetings;