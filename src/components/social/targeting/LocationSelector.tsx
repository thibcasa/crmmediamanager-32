import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

interface Location {
  id: string;
  city: string;
  postal_code: string;
  department: string;
  region: string;
}

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export const LocationSelector = ({ selectedLocations, onLocationChange }: LocationSelectorProps) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('target_locations')
          .select('*')
          .order('city');

        if (error) throw error;
        setLocations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des locations:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les zones géographiques",
          variant: "destructive"
        });
      }
    };

    fetchLocations();
  }, [toast]);

  return (
    <Card className="p-6">
      <Label className="text-lg font-medium">Zones géographiques ciblées</Label>
      <p className="text-sm text-muted-foreground mb-4">
        Sélectionnez les zones que vous souhaitez cibler
      </p>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedLocations.includes(location.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() => {
                const newLocations = selectedLocations.includes(location.id)
                  ? selectedLocations.filter(id => id !== location.id)
                  : [...selectedLocations, location.id];
                onLocationChange(newLocations);
              }}
            >
              <div className="font-medium">{location.city}</div>
              <div className="text-sm opacity-90">
                {location.postal_code} - {location.department}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};