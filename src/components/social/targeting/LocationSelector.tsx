import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { MapPin } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [toast]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <Label className="text-lg font-medium">Zones géographiques ciblées</Label>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Sélectionnez les zones que vous souhaitez cibler pour votre campagne
      </p>

      {loading ? (
        <div className="text-center py-4">Chargement des zones...</div>
      ) : (
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-2">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-start space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Checkbox
                  id={location.id}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={(checked) => {
                    const newLocations = checked
                      ? [...selectedLocations, location.id]
                      : selectedLocations.filter(id => id !== location.id);
                    onLocationChange(newLocations);
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={location.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {location.city}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {location.postal_code} - {location.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};